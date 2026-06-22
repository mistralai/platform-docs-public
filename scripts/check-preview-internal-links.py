#!/usr/bin/env python3
import argparse
import concurrent.futures
import html.parser
import re
import sys
from collections import defaultdict
from dataclasses import dataclass
from typing import Iterable
from urllib.error import HTTPError, URLError
from urllib.parse import urldefrag, urljoin, urlparse
from urllib.request import Request, urlopen


SKIP_SCHEMES = {"mailto", "tel", "javascript", "data", "blob"}


class LinkExtractor(html.parser.HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[tuple[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        for name, value in attrs:
            if not value:
                continue
            if name in {"href", "src", "poster"}:
                self.links.append((name, value))
            elif name == "srcset":
                for candidate in value.split(","):
                    url = candidate.strip().split(" ", 1)[0]
                    if url:
                        self.links.append((name, url))


@dataclass(frozen=True)
class BrokenLink:
    source: str
    url: str
    status: str


def fetch_text(url: str, timeout: int) -> str:
    req = Request(url, headers={"User-Agent": "Mistral-docs-internal-link-checker"})
    with urlopen(req, timeout=timeout) as response:
        return response.read().decode("utf-8", errors="replace")


def fetch_status(url: str, timeout: int) -> tuple[int | None, str]:
    headers = {"User-Agent": "Mistral-docs-internal-link-checker"}
    for method in ("HEAD", "GET"):
        req = Request(url, headers=headers, method=method)
        try:
            with urlopen(req, timeout=timeout) as response:
                return response.status, str(response.status)
        except HTTPError as error:
            if method == "HEAD" and error.code in {403, 405, 501}:
                continue
            return error.code, str(error.code)
        except URLError as error:
            return None, str(error.reason)
        except Exception as error:
            return None, str(error)
    return None, "unknown"


def sitemap_urls(preview_url: str, timeout: int) -> list[str]:
    preview_url = preview_url.rstrip("/")
    sitemap = fetch_text(f"{preview_url}/sitemap.xml", timeout)
    urls = []
    for loc in re.findall(r"<loc>([^<]+)</loc>", sitemap):
        parsed = urlparse(loc)
        path = parsed.path or "/"
        if parsed.query:
            path = f"{path}?{parsed.query}"
        urls.append(f"{preview_url}{path}")
    return sorted(dict.fromkeys(urls))


def internal_links(page_url: str, html: str, preview_host: str) -> set[str]:
    parser = LinkExtractor()
    parser.feed(html)

    links = set()
    for _, raw_url in parser.links:
        raw_url = raw_url.strip()
        if not raw_url or raw_url.startswith("#"):
            continue

        parsed_raw = urlparse(raw_url)
        if parsed_raw.scheme in SKIP_SCHEMES:
            continue

        absolute_url = urljoin(page_url, raw_url)
        absolute_url, _ = urldefrag(absolute_url)
        parsed = urlparse(absolute_url)
        if parsed.scheme not in {"http", "https"}:
            continue
        if parsed.netloc != preview_host:
            continue
        links.add(absolute_url)
    return links


def check_page(page_url: str, preview_host: str, timeout: int) -> tuple[str, set[str], BrokenLink | None]:
    status, status_text = fetch_status(page_url, timeout)
    if status is None or status >= 400:
        return page_url, set(), BrokenLink(page_url, page_url, status_text)

    try:
        html = fetch_text(page_url, timeout)
    except Exception as error:
        return page_url, set(), BrokenLink(page_url, page_url, str(error))

    return page_url, internal_links(page_url, html, preview_host), None


def write_report(output: str, total_links: int, unique_links: int, checked_pages: int, broken: Iterable[BrokenLink]) -> None:
    broken = list(broken)
    grouped: dict[str, list[BrokenLink]] = defaultdict(list)
    for item in broken:
        grouped[item.source].append(item)

    with open(output, "w", encoding="utf-8") as report:
        report.write("# Summary\n\n")
        report.write("| Status | Count |\n")
        report.write("|---|---:|\n")
        report.write(f"| Pages checked | {checked_pages} |\n")
        report.write(f"| Total internal links | {total_links} |\n")
        report.write(f"| Unique internal links | {unique_links} |\n")
        report.write(f"| Broken internal links | {len(broken)} |\n")
        report.write("\n")

        if broken:
            report.write("## Errors per input\n\n")
            for source in sorted(grouped):
                report.write(f"### Errors in {source}\n\n")
                for item in sorted(grouped[source], key=lambda link: link.url):
                    report.write(f"* [{item.status}] <{item.url}>\n")
                report.write("\n")


def main() -> int:
    parser = argparse.ArgumentParser(description="Check same-origin links on a deployed docs preview.")
    parser.add_argument("preview_url")
    parser.add_argument("--output", default="link-reports/internal-links.md")
    parser.add_argument("--timeout", type=int, default=20)
    parser.add_argument("--workers", type=int, default=24)
    parser.add_argument("--limit", type=int, default=0, help="Limit pages checked. Useful for local smoke tests.")
    args = parser.parse_args()

    preview_url = args.preview_url.rstrip("/")
    preview_host = urlparse(preview_url).netloc
    pages = sitemap_urls(preview_url, args.timeout)
    if args.limit:
        pages = pages[: args.limit]

    broken: list[BrokenLink] = []
    page_links: dict[str, set[str]] = {}

    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = [executor.submit(check_page, page, preview_host, args.timeout) for page in pages]
        for future in concurrent.futures.as_completed(futures):
            page_url, links, page_error = future.result()
            page_links[page_url] = links
            if page_error:
                broken.append(page_error)

    link_sources: dict[str, list[str]] = defaultdict(list)
    for source, links in page_links.items():
        for link in links:
            link_sources[link].append(source)

    status_cache: dict[str, tuple[int | None, str]] = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as executor:
        future_to_link = {
            executor.submit(fetch_status, link, args.timeout): link
            for link in sorted(link_sources)
        }
        for future in concurrent.futures.as_completed(future_to_link):
            link = future_to_link[future]
            status_cache[link] = future.result()

    for link, sources in link_sources.items():
        status, status_text = status_cache[link]
        if status is None or status >= 400:
            for source in sources:
                broken.append(BrokenLink(source, link, status_text))

    total_links = sum(len(links) for links in page_links.values())
    write_report(args.output, total_links, len(link_sources), len(pages), broken)

    if broken:
        print(f"Found {len(broken)} broken internal link occurrence(s). Report: {args.output}", file=sys.stderr)
        return 1
    print(f"All internal links OK across {len(pages)} page(s). Report: {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
