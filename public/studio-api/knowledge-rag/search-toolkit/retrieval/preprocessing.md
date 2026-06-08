---
title: Query preprocessing
description: Improve user queries before retrieval for better results.
sidebar_position: 4
sidebar_label: Query preprocessing
---

# Query preprocessing

Query preprocessing improves user queries before retrieval. Techniques like rewriting and expansion can significantly improve retrieval quality, though they increase latency and cost.

<SectionTab as="h1" sectionId="llm-query-rewriter">LLM Query Rewriter</SectionTab>

Uses an LLM to reformulate queries into forms more likely to match indexed content. Converts informal language into structured queries, expands abbreviations, and clarifies intent.

**Installation**: Core library (no extra required)

**Example**:

```python
from mistralai.search.toolkit.retrieval.pre_processors import LLMQueryRewriter
from mistralai.search.toolkit.llm import MistralChat, LLMConfig
from mistralai.client import Mistral

llm = MistralChat(
    client=Mistral(api_key="your-api-key"),
    config=LLMConfig(model="mistral-small-latest"),
)

rewriter = LLMQueryRewriter(llm_provider=llm)

# Original: "rag mistral"
rewritten = await rewriter.rewrite("rag mistral")
# Result: "What is Retrieval-Augmented Generation with Mistral AI?"

# Use in QueryEngine
query_engine = QueryEngine(
    retriever=vector_retriever,
    query_rewriter=rewriter,
)

result = await query_engine.search(query="rag mistral")
# Query is rewritten before retrieval
```

**Configuration options**:

| Option | Type | Default | Purpose |
|--------|------|---------|---------|
| `llm_provider` | LLMProvider | Required | LLM to use for rewriting (MistralChat, etc.) |

**Custom rewriting prompt**:

```python
from mistralai.search.toolkit.retrieval.pre_processors import LLMQueryRewriter
from mistralai.search.toolkit.llm import MistralChat, LLMConfig

llm = MistralChat(
    client=Mistral(api_key="your-api-key"),
    config=LLMConfig(model="mistral-small-latest"),
)

# With custom prompt
rewriter = LLMQueryRewriter(
    llm_provider=llm,
    prompt="Reformulate this query for a technical documentation search engine: ",
)

rewritten = await rewriter.rewrite("how to set up django")
```

**When to use**:
- Short or informal queries that need expansion
- Queries with acronyms or domain-specific abbreviations
- Improving recall for vague user input
- Converting questions into keyword combinations

**Cost considerations**:
- 1 LLM call per query
- Adds 100-500ms latency
- Use strategically, not for every query

<SectionTab as="h1" sectionId="llm-query-extension">LLM Query Extension</SectionTab>

Breaks a query into multiple sub-queries exploring different facets. Each sub-query runs an independent retrieval pass; results are combined for broader recall.

**Installation**: Core library (no extra required)

**Example**:

```python
from mistralai.search.toolkit.retrieval.pre_processors import LLMQueryExtension
from mistralai.search.toolkit.llm import MistralChat, LLMConfig
from mistralai.client import Mistral

llm = MistralChat(
    client=Mistral(api_key="your-api-key"),
    config=LLMConfig(model="mistral-small-latest"),
)

extender = LLMQueryExtension(
    llm_provider=llm,
    num_queries=3,  # Generate 3 sub-queries
)

# Original: "How does RAG work?"
extended = await extender.extend("How does RAG work?")
# Results in:
# - "What is RAG?"
# - "How does retrieval work in RAG?"
# - "How does generation work in RAG?"

# Use in QueryEngine
query_engine = QueryEngine(
    retriever=vector_retriever,
    query_rewriter=extender,
)

result = await query_engine.search(query="How does RAG work?")
# All 3 sub-queries are retrieved and results combined
```

**Configuration options**:

| Option | Type | Default | Purpose |
|--------|------|---------|---------|
| `llm_provider` | LLMProvider | Required | LLM to use for extension (MistralChat, etc.) |
| `num_queries` | int | 3 | Number of sub-queries to generate |

**Cost and performance**:

```python
# num_queries=3 means:
# - 1 LLM call to generate sub-queries
# - 3 retrieval passes (3x slower)
# - 3x embedding calls (for each sub-query)
# - Results combined/deduplicated

# Choose based on tolerance:
extender = LLMQueryExtension(llm_provider=llm, num_queries=2)  # Faster, lower recall
extender = LLMQueryExtension(llm_provider=llm, num_queries=5)  # Slower, higher recall
```

**When to use**:
- Complex queries with multiple aspects
- Improving recall across different facets
- Multi-faceted questions that need broad coverage
- When latency tolerance allows for multiple retrievals

**Best practice - combine with reranking**:

```python
query_engine = QueryEngine(
    retriever=vector_retriever,
    query_rewriter=LLMQueryExtension(llm_provider=llm, num_queries=3),
    rerankers=[LLMReRanker(llm_provider=llm, top_k=10)],
)

# Flow:
# 1. 1 query → 3 sub-queries (LLM call)
# 2. 3 retrieval passes (3x embedding + vector search)
# 3. ~30 results combined
# 4. LLM reranking narrows to top 10 (1 more LLM call)
# Total: 2 LLM calls + 3 vector searches + deduplication + reranking
result = await query_engine.search(query="...", top_k=10)
```

<SectionTab as="h1" sectionId="custom-preprocessors">Custom query preprocessors</SectionTab>

Implement the `QueryPreprocessor` protocol:

```python
from mistralai.search.toolkit.retrieval.pre_processors import QueryPreprocessor

class DomainSpecificRewriter(QueryPreprocessor):
    """Rewrite queries for a specific domain."""

    async def preprocess(self, query: str) -> str:
        """Preprocess the query."""
        # 1. Normalize
        normalized = query.lower().strip()

        # 2. Expand domain-specific abbreviations
        expansions = {
            "ml": "machine learning",
            "nlp": "natural language processing",
            "ai": "artificial intelligence",
        }
        for abbr, expansion in expansions.items():
            normalized = normalized.replace(f" {abbr} ", f" {expansion} ")

        # 3. Add domain context if needed
        if "algorithm" in normalized:
            normalized += " implementation approach"

        return normalized

rewriter = DomainSpecificRewriter()
query_engine = QueryEngine(
    retriever=vector_retriever,
    query_rewriter=rewriter,
)
```

<SectionTab as="h1" sectionId="when-to-use">When to use query preprocessing</SectionTab>

**Use preprocessing if**:
- User queries are short/vague (e.g., "rag" instead of full questions)
- Your index has highly specific terminology
- You need better recall for multi-faceted questions
- Latency tolerance allows for extra LLM calls

**Skip preprocessing if**:
- User queries are already well-formed
- Latency is critical (real-time chat)
- Cost is a concern (each LLM call adds up)
- Vector retrieval alone gives good results

**Hybrid approach**:

```python
# Optional preprocessing based on query length
class OptionalRewriter(QueryPreprocessor):
    async def preprocess(self, query: str) -> str:
        # Only rewrite short queries
        if len(query.split()) < 3:
            # Expand short query
            return await llm.rewrite(query)
        return query

query_engine = QueryEngine(
    retriever=vector_retriever,
    query_rewriter=OptionalRewriter(),
)
```

<SectionTab as="h1" sectionId="see-also">See also</SectionTab>

- [Retrieval overview](../retrieval) — Retrieval pipeline architecture
- [Retrievers](retrievers) — Vector and keyword search
- [Rerankers](rerankers) — Refine results after retrieval
- [Semantic cache](semantic-cache) — Cache preprocessed queries