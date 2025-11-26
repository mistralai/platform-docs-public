#!/usr/bin/env python3
"""
Mistral Document Library Sync Tool.

Synchronizes converted Markdown documentation files to a Mistral Document Library
with async batch processing, rate limiting, and comprehensive error handling.

Usage:
    python support_library_sync.py /path/to/md/files --full-sync
    python support_library_sync.py /path/to/md/files --dry-run
"""

import argparse
import asyncio
import logging
import os
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import ClassVar

import httpx

API_KEY = os.getenv("MISTRAL_API_KEY")
LIBRARY_ID = os.getenv("LIBRARY_ID")
CONCURRENCY = 5
MAX_RETRIES = 5
RETRY_DELAY = 2.0

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)


@dataclass
class SyncConfig:
    """Configuration for library synchronization."""

    api_key: str
    library_id: str
    source_dir: Path
    concurrency: int = CONCURRENCY
    full_sync: bool = False
    dry_run: bool = False
    max_retries: int = MAX_RETRIES
    retry_delay: float = RETRY_DELAY


@dataclass
class SyncStats:
    """Statistics for sync operation."""

    uploaded: int = 0
    deleted: int = 0
    skipped: int = 0
    failed: int = 0

    def __str__(self) -> str:
        return (
            f"Uploaded: {self.uploaded} | Deleted: {self.deleted} | "
            f"Skipped: {self.skipped} | Failed: {self.failed}"
        )


@dataclass
class DocumentInfo:
    """Document metadata container."""

    id: str
    file_name: str
    processing_status: str | None = None


class LibrarySyncClient:
    """Async client for synchronizing documents to Mistral Document Library."""

    BASE_URL: ClassVar[str] = "https://api.mistral.ai/v1"
    RETRYABLE_STATUS_CODES: ClassVar[set[int]] = {429, 500, 502, 503, 504}

    def __init__(self, config: SyncConfig) -> None:
        self._config = config
        self._semaphore = asyncio.Semaphore(config.concurrency)
        self._client: httpx.AsyncClient | None = None

    async def __aenter__(self) -> "LibrarySyncClient":
        self._client = httpx.AsyncClient(
            base_url=self.BASE_URL,
            headers={
                "Authorization": f"Bearer {self._config.api_key}",
                "Accept": "application/json",
            },
            timeout=httpx.Timeout(60.0),
        )
        return self

    async def __aexit__(self, *_) -> None:
        if self._client:
            await self._client.aclose()

    async def _request_with_retry(
        self, method: str, url: str, **kwargs
    ) -> httpx.Response:
        """Execute HTTP request with exponential backoff retry for transient errors."""
        last_exception: Exception | None = None

        assert self._client is not None
        for attempt in range(self._config.max_retries):
            try:
                async with self._semaphore:
                    response = await self._client.request(method, url, **kwargs)
                    response.raise_for_status()
                    return response
            except httpx.HTTPStatusError as e:
                if e.response.status_code not in self.RETRYABLE_STATUS_CODES:
                    raise
                last_exception = e
            except httpx.RequestError as e:
                last_exception = e

            if attempt < self._config.max_retries - 1:
                delay = self._config.retry_delay * (2**attempt)
                logger.debug(
                    f"Retry {attempt + 1}/{self._config.max_retries} after {delay}s"
                )
                await asyncio.sleep(delay)

        raise last_exception  # type: ignore[misc]

    async def list_documents(self) -> list[DocumentInfo]:
        """Retrieve all documents from the library with pagination."""
        documents: list[DocumentInfo] = []
        page = 0
        page_size = 100

        while True:
            response = await self._request_with_retry(
                "GET",
                f"/libraries/{self._config.library_id}/documents",
                params={"page": page, "page_size": page_size},
            )

            data = response.json()
            items = data.get("data", [])

            if not items:
                break

            for doc in items:
                documents.append(
                    DocumentInfo(
                        id=doc["id"],
                        file_name=doc["name"],
                        processing_status=doc.get("processing_status"),
                    )
                )

            if len(items) < page_size:
                break
            page += 1

        logger.info(f"Found {len(documents)} existing documents in library")
        return documents

    async def delete_document(self, document_id: str) -> bool:
        """Delete a single document from the library."""
        try:
            await self._request_with_retry(
                "DELETE",
                f"/libraries/{self._config.library_id}/documents/{document_id}",
            )
            return True
        except httpx.HTTPStatusError as e:
            logger.error(f"Failed to delete document {document_id}: {e}")
            return False

    async def delete_documents_batch(self, documents: list[DocumentInfo]) -> int:
        """Delete multiple documents concurrently."""
        if not documents:
            return 0

        tasks = [self.delete_document(doc.id) for doc in documents]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        deleted = sum(1 for r in results if r is True)
        logger.info(f"Deleted {deleted}/{len(documents)} documents")
        return deleted

    async def upload_document(self, file_path: Path) -> str | None:
        """Upload a single document to the library."""
        try:
            content = file_path.read_bytes()
            files = {"file": (file_path.name, content, "text/markdown")}

            response = await self._request_with_retry(
                "POST", f"/libraries/{self._config.library_id}/documents", files=files
            )

            return response.json()["id"]
        except httpx.HTTPStatusError as e:
            logger.error(f"Failed to upload {file_path.name}: {e}")
            return None

    async def upload_documents_batch(
        self, file_paths: list[Path]
    ) -> tuple[list[tuple[Path, str]], list[Path]]:
        """Upload multiple documents concurrently."""
        if not file_paths:
            return [], []

        tasks = [self.upload_document(path) for path in file_paths]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        successful: list[tuple[Path, str]] = []
        failed: list[Path] = []

        for path, result in zip(file_paths, results, strict=True):
            if isinstance(result, str):
                successful.append((path, result))
                logger.info(f"Uploaded: {path.name} -> {result}")
            else:
                failed.append(path)

        return successful, failed

    async def sync(self) -> SyncStats:
        """Execute full synchronization."""
        stats = SyncStats()

        if self._config.dry_run:
            return await self._dry_run()

        existing_docs = await self.list_documents()
        existing_names = {doc.file_name for doc in existing_docs}

        if self._config.full_sync and existing_docs:
            logger.info("Full sync mode: deleting existing documents...")
            stats.deleted = await self.delete_documents_batch(existing_docs)
            existing_names = set()

        md_files = list(self._config.source_dir.glob("*.md"))
        logger.info(f"Found {len(md_files)} MD files to process")

        if not self._config.full_sync:
            to_upload = [f for f in md_files if f.name not in existing_names]
            stats.skipped = len(md_files) - len(to_upload)
            if stats.skipped:
                logger.info(f"Skipping {stats.skipped} existing files")
        else:
            to_upload = md_files

        if to_upload:
            logger.info(
                f"Uploading {len(to_upload)} files (concurrency: {self._config.concurrency})"
            )
            successful, failed = await self.upload_documents_batch(to_upload)
            stats.uploaded = len(successful)
            stats.failed = len(failed)

        return stats

    async def _dry_run(self) -> SyncStats:
        """Preview sync operation without making changes."""
        stats = SyncStats()

        existing_docs = await self.list_documents()
        existing_names = {doc.file_name for doc in existing_docs}
        md_files = list(self._config.source_dir.glob("*.md"))

        logger.info("=== DRY RUN ===")

        if self._config.full_sync:
            logger.info(f"Would delete {len(existing_docs)} existing documents")
            stats.deleted = len(existing_docs)
            to_upload = md_files
        else:
            to_upload = [f for f in md_files if f.name not in existing_names]
            stats.skipped = len(md_files) - len(to_upload)

        logger.info(f"Would upload {len(to_upload)} files:")
        for f in to_upload[:10]:
            logger.info(f"  - {f.name}")
        if len(to_upload) > 10:
            logger.info(f"  ... and {len(to_upload) - 10} more")

        stats.uploaded = len(to_upload)
        return stats


def main() -> int:
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Sync MD files to Mistral Document Library",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("source_dir", type=Path, help="Directory containing MD files")
    parser.add_argument(
        "--full-sync", action="store_true", help="Delete existing docs before upload"
    )
    parser.add_argument(
        "--dry-run", action="store_true", help="Preview without executing"
    )
    parser.add_argument(
        "-v", "--verbose", action="store_true", help="Enable debug logging"
    )
    args = parser.parse_args()

    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    if not args.source_dir.exists():
        logger.error(f"Source directory not found: {args.source_dir}")
        return 1

    if not args.source_dir.is_dir():
        logger.error(f"Source path is not a directory: {args.source_dir}")
        return 1

    if not API_KEY:
        logger.error("MISTRAL_API_KEY environment variable is required")
        return 1

    if not LIBRARY_ID:
        logger.error("LIBRARY_ID environment variable is required")
        return 1

    config = SyncConfig(
        api_key=API_KEY,
        library_id=LIBRARY_ID,
        source_dir=args.source_dir,
        full_sync=args.full_sync,
        dry_run=args.dry_run,
    )

    logger.info(f"Syncing {config.source_dir} -> Library {config.library_id}")
    logger.info("-" * 60)

    try:

        async def run() -> SyncStats:
            async with LibrarySyncClient(config) as client:
                return await client.sync()

        stats = asyncio.run(run())

        logger.info("-" * 60)
        logger.info(f"Sync complete: {stats}")

        return 0 if stats.failed == 0 else 1

    except httpx.HTTPStatusError as e:
        logger.error(f"API error: {e}")
        return 1
    except httpx.RequestError as e:
        logger.error(f"Network error: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
