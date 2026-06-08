---
title: Chunk enrichers
description: Add custom metadata to chunks during ingestion.
sidebar_position: 6
sidebar_label: Chunk enrichers
---

Chunk enrichers add custom metadata to chunks during ingestion. Use them to attach information from external sources, classifications, tags, or any computed metadata.

<SectionTab as="h2" sectionId="available-chunk-enrichers">Available chunk enrichers</SectionTab>

| Enricher | Purpose |
|----------|---------|
| **[Summary Enricher](#summary-enricher)** | Generate document summaries using an LLM |
| **[Custom Enrichers](#creating-custom-enrichers)** | Add custom metadata from any source |

<SectionTab as="h1" sectionId="summary-enricher">Summary Enricher</SectionTab>

`SummaryEnricher` generates a document summary using an LLM and optionally injects it into chunks and/or document metadata. This can improve retrieval by giving each chunk context about the full document.

By default, `SummaryEnricher` is non-breaking: if summary generation fails, it logs the failure and returns the original chunks unchanged.

**Requirements**:

- A Mistral API key

**Usage**:

```python
import os

from mistralai.client import Mistral
from mistralai.search.toolkit.ingestion.enrichment import SummaryEnricher, SummaryConfig, SummarizeRequestConfig
from mistralai.search.toolkit.llm import MistralChat, LLMConfig

# Create LLM provider
mistral_client = Mistral(api_key=os.environ.get("MISTRAL_API_KEY", "your-api-key"))
llm = MistralChat(client=mistral_client, config=LLMConfig(model="mistral-small-latest"))

# Create enricher with default settings
enricher = SummaryEnricher(llm_provider=llm)

# Or customize the summary behavior
enricher = SummaryEnricher(
    llm_provider=llm,
    summary_config=SummaryConfig(
        request_config=SummarizeRequestConfig(
            prompt="Summarize this document in 3 sentences.",
            max_tokens=256,
        ),
    ),
)
```

**Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `llm_provider` | `ChatLLMProvider` | *(required)* | LLM provider for summarization |
| `summary_config` | `SummaryConfig \| None` | `None` | Configuration object (see below) |

**SummarizeRequestConfig**:

Controls the LLM request for summary generation.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `model` | `str` | `"mistral-small-latest"` | Model to use for summarization |
| `prompt` | `str` | `"Summarize the document in less than 5 lines."` | Summarization prompt |
| `max_tokens` | `int` | `256` | Maximum tokens in the summary |
| `truncate_at` | `int \| None` | `32768` | Truncate document content before sending to LLM |
| `temperature` | `float \| None` | `0.6` | LLM temperature |

**SummaryRequestOptions**:

Controls how the summary is injected into the pipeline output.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `include_summary_chunk` | `bool` | `True` | Add a dedicated summary chunk to the chunk list |
| `propagate_summary_to_chunks` | `bool` | `False` | Prepend the summary to every chunk's content |
| `populate_document_metadata` | `bool` | `True` | Store the summary in the document's metadata |
| `fail_on_generation_error` | `bool` | `False` | Raise on summary generation failure instead of logging and continuing |

<SectionTab as="h1" sectionId="creating-custom-enrichers">Creating custom enrichers</SectionTab>

Implement the `ChunkEnricher` interface to add custom metadata:

```python
from mistralai.search.toolkit.ingestion.enrichment import ChunkEnricher
from mistralai.search.toolkit.document import DocumentChunk, Document

class EntityTagger(ChunkEnricher):
    """Add entity tags to chunks."""

    async def enrich_chunks(
        self, chunks: list[DocumentChunk], document: Document, concurrency: int = 10
    ) -> tuple[list[DocumentChunk], Document]:
        enriched = []
        for chunk in chunks:
            entities = await self._extract_entities(chunk.content)
            updated_metadata = chunk.metadata.model_copy(update={"entities": entities})
            enriched.append(chunk.model_copy(update={"metadata": updated_metadata}))

        return enriched, document

    async def _extract_entities(self, text: str) -> list[str]:
        entities = []
        # ... entity extraction logic ...
        return entities

enricher = EntityTagger()
enriched_chunks, document = await enricher.enrich_chunks(chunks, document)

for chunk in enriched_chunks:
    print(f"Entities: {chunk.metadata.get('entities', [])}")
```

### Batch enrichment patterns

For performance with many chunks, use concurrency and batch external API calls:

```python
import asyncio
from mistralai.search.toolkit.ingestion.enrichment import ChunkEnricher
from mistralai.search.toolkit.document import DocumentChunk, Document

class BatchEnricher(ChunkEnricher):
    """Batch API calls for efficiency."""

    async def enrich_chunks(
        self, chunks: list[DocumentChunk], document: Document, concurrency: int = 10
    ) -> tuple[list[DocumentChunk], Document]:
        # Use concurrency limit for external API calls
        semaphore = asyncio.Semaphore(concurrency)

        async def enrich_one(chunk: DocumentChunk) -> DocumentChunk:
            async with semaphore:
                metadata = await self._fetch_metadata(chunk.content)
                return chunk.model_copy(
                    update={"metadata": chunk.metadata.model_copy(update=metadata)}
                )

        enriched = await asyncio.gather(
            *[enrich_one(c) for c in chunks]
        )
        return enriched, document

    async def _fetch_metadata(self, text: str) -> dict:
        # Call external API with batching/retries
        ...
```

### Combining multiple enrichers

```python
from mistralai.search.toolkit.ingestion.pipelines import Pipeline

pipeline = Pipeline(
    loader=loader,
    extractor=extractor,
    text_splitter=splitter,
    embedder=embedder,
    vector_store=vector_store,
    chunk_enrichers=[
        SummaryEnricher(llm_provider=llm),
        EntityTagger(),
        CustomMetadataEnricher(),
    ],
)
```

Enrichers are applied sequentially in the order listed. Each enricher receives the output of the previous one.