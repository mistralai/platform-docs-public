#!/usr/bin/env -S uv run --script
#
# /// script
# requires-python = ">=3.13"
# dependencies = []
# ///
"""
MDX to Markdown Converter.

Converts MDX documentation files to standard Markdown format by removing
React/JSX components, imports, exports, and frontmatter while preserving content.

Usage:
    python support_library_convert.py --source api
    python support_library_convert.py --source docs --dry-run
"""

import argparse
import logging
import re
import sys
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)


@dataclass
class SourceConfig:
    """Configuration for a documentation source."""

    name: str
    path: Path


@dataclass
class ConversionStats:
    """Statistics for conversion operation."""

    converted: int = 0
    skipped: int = 0
    failed: int = 0

    def __add__(self, other: "ConversionStats") -> "ConversionStats":
        return ConversionStats(
            converted=self.converted + other.converted,
            skipped=self.skipped + other.skipped,
            failed=self.failed + other.failed,
        )

    def __str__(self) -> str:
        return f"Converted: {self.converted} | Skipped: {self.skipped} | Failed: {self.failed}"


class MDXCleaner:
    """Handles cleaning of MDX-specific syntax from content."""

    _FRONTMATTER = re.compile(r"^---\n.*?^---\n", re.MULTILINE | re.DOTALL)

    _IMPORTS = re.compile(
        r"^import\s+.*?(?:;|from\s+['\"][^'\"]+['\"];?)\s*$", re.MULTILINE
    )
    _EXPORTS = re.compile(r"^export\s+.*?;\s*$", re.MULTILINE)

    _JSX_SELF_CLOSING = re.compile(r"<[A-Z][a-zA-Z0-9]*(?:\s+[^>]*)?/>\s*", re.DOTALL)
    _JSX_OPEN = re.compile(r"<[A-Z][a-zA-Z0-9]*(?:\s+[^>]*)?>", re.DOTALL)
    _JSX_CLOSE = re.compile(r"</[A-Z][a-zA-Z0-9]*>")

    _JSX_COMMENT = re.compile(r"\{/\*.*?\*/\}", re.DOTALL)
    _JSX_EXPRESSION = re.compile(r"\{[^{}]*\}")

    _JSON_ARTIFACTS = re.compile(
        r'^.*"(?:breakoutSubTypes|linkedLabel|children)".*$', re.MULTILINE
    )

    _EMPTY_BLOCKQUOTE = re.compile(r"^\s*>\s*$", re.MULTILINE)
    _MULTIPLE_NEWLINES = re.compile(r"\n{3,}")

    @classmethod
    def clean(cls, content: str) -> str:
        """Clean MDX content to standard Markdown."""
        result = content

        result = cls._FRONTMATTER.sub("", result)
        result = cls._IMPORTS.sub("", result)
        result = cls._EXPORTS.sub("", result)

        result = cls._JSX_COMMENT.sub("", result)
        result = cls._JSX_SELF_CLOSING.sub("", result)
        result = cls._JSX_OPEN.sub("", result)
        result = cls._JSX_CLOSE.sub("", result)

        for _ in range(3):
            result = cls._JSX_EXPRESSION.sub("", result)

        result = cls._JSON_ARTIFACTS.sub("", result)
        result = cls._EMPTY_BLOCKQUOTE.sub("", result)
        result = cls._MULTIPLE_NEWLINES.sub("\n\n", result)

        return result.strip() + "\n"


class MDXConverter:
    """Converter for MDX to Markdown files."""

    def __init__(self, output_dir: Path, max_files: int = 0) -> None:
        self._output_dir = output_dir
        self._max_files = max_files

    def convert_file(
        self, source_name: str, source_dir: Path, mdx_path: Path
    ) -> Path | None:
        """Convert a single MDX file to Markdown."""
        try:
            content = mdx_path.read_text(encoding="utf-8")
            cleaned_content = MDXCleaner.clean(content)

            rel_path = mdx_path.relative_to(source_dir)
            parts = [*list(rel_path.parts[:-1]), rel_path.stem]
            md_filename = f"{source_name}_{'_'.join(parts)}.md"
            md_path = self._output_dir / md_filename

            md_path.write_text(cleaned_content, encoding="utf-8")
            return md_path

        except Exception as e:
            logger.error(f"Failed to convert {mdx_path}: {e}")
            return None

    def convert_source(self, source: SourceConfig) -> ConversionStats:
        """Convert all MDX files from a single source."""
        stats = ConversionStats()

        if not source.path.exists():
            logger.warning(f"Source path not found: {source.path}")
            return stats

        mdx_files = list(source.path.rglob("*.mdx"))
        logger.info(f"[{source.name}] Found {len(mdx_files)} MDX files")

        if self._max_files > 0 and len(mdx_files) > self._max_files:
            return self._convert_with_merge(source, mdx_files)

        for mdx_path in mdx_files:
            if self.convert_file(source.name, source.path, mdx_path):
                stats.converted += 1
            else:
                stats.failed += 1

        return stats

    def _convert_with_merge(
        self, source: SourceConfig, mdx_files: list[Path]
    ) -> ConversionStats:
        """Convert MDX files with merging to stay under max_files limit."""
        stats = ConversionStats()

        file_data: list[tuple[list[str], str]] = []
        for mdx_path in mdx_files:
            try:
                content = mdx_path.read_text(encoding="utf-8")
                cleaned = MDXCleaner.clean(content)
                rel_path = mdx_path.relative_to(source.path)
                parts = [*list(rel_path.parts[:-1]), rel_path.stem]
                file_data.append((parts, cleaned))
            except Exception as e:
                logger.error(f"Failed to convert {mdx_path}: {e}")
                stats.failed += 1

        if not file_data:
            return stats

        sections = self._group_files(source.name, file_data)
        logger.info(f"[{source.name}] Merging into {len(sections)} files")

        for section_key, contents in sections.items():
            merged = "\n\n---\n\n".join(contents)
            md_path = self._output_dir / f"{section_key}.md"

            try:
                md_path.write_text(merged, encoding="utf-8")
                stats.converted += 1
            except Exception as e:
                logger.error(f"Failed to write {md_path}: {e}")
                stats.failed += 1

        return stats

    def _group_files(
        self, source_name: str, file_data: list[tuple[list[str], str]]
    ) -> dict[str, list[str]]:
        """Group files by path prefix to reduce total count under max_files."""
        max_depth = max(len(parts) for parts, _ in file_data)

        for depth in range(max_depth, -1, -1):
            sections: dict[str, list[str]] = defaultdict(list)

            for parts, cleaned in file_data:
                if depth >= len(parts):
                    key = f"{source_name}_{'_'.join(parts)}"
                else:
                    key_parts = parts[: len(parts) - depth] if depth > 0 else []
                    key = (
                        f"{source_name}_{'_'.join(key_parts)}"
                        if key_parts
                        else source_name
                    )

                header = f"# {'/'.join(parts)}\n\n"
                sections[key].append(header + cleaned)

            if len(sections) <= self._max_files:
                return dict(sections)

        logger.warning(f"Could not reduce to {self._max_files} files")
        return dict(sections)

    def convert_sources(self, sources: list[SourceConfig]) -> ConversionStats:
        """Convert MDX files from multiple sources."""
        self._output_dir.mkdir(parents=True, exist_ok=True)

        total = ConversionStats()
        for source in sources:
            total = total + self.convert_source(source)

        return total


SCRIPT_DIR = Path(__file__).parent
REPO_ROOT = SCRIPT_DIR.parent.parent.parent
MAX_FILES = 100

SOURCES: dict[str, SourceConfig] = {
    "api": SourceConfig(name="api", path=REPO_ROOT / "src/app/(api)"),
    "docs": SourceConfig(name="docs", path=REPO_ROOT / "src/app/(docs)"),
}

OUTPUT_DIR = REPO_ROOT / "output"


def main() -> int:
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Convert MDX documentation to Markdown"
    )
    parser.add_argument(
        "--source", choices=list(SOURCES.keys()), help="Convert only specified source"
    )
    parser.add_argument(
        "--dry-run", action="store_true", help="Preview changes without executing"
    )
    parser.add_argument(
        "-v", "--verbose", action="store_true", help="Enable debug logging"
    )
    args = parser.parse_args()

    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    sources = [SOURCES[args.source]] if args.source else list(SOURCES.values())

    if args.dry_run:
        logger.info("=== DRY RUN ===")
        for source in sources:
            if source.path.exists():
                count = len(list(source.path.rglob("*.mdx")))
                logger.info(f"[{source.name}] Would convert {count} files")
            else:
                logger.warning(f"[{source.name}] Source not found: {source.path}")
        return 0

    logger.info(f"Converting MDX files to {OUTPUT_DIR}")
    logger.info("-" * 60)

    converter = MDXConverter(OUTPUT_DIR, MAX_FILES)
    stats = converter.convert_sources(sources)

    logger.info("-" * 60)
    logger.info(f"Conversion complete: {stats}")

    return 0 if stats.failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
