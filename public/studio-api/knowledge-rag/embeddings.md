# Embeddings

**Embeddings** are vector representations of text that capture the semantic meaning of paragraphs through their position in a high-dimensional vector space. Mistral's Embeddings API provides embeddings for text and code, which you can use for natural language processing (NLP) tasks.

<Image
  url={['/img/embedding_graph.png', '/img/embedding_graph_dark.png']}
  alt="embedding_graph"
  width="500px"
  centered
/>

Embeddings can power retrieval systems for retrieval-augmented generation, clustering for unorganized data, document classification, semantic code search, code analytics, duplicate detection, and search across raw text or code sources.

If you want a managed feature that ingests, vectorizes, and searches documents for you, use [Libraries](/studio-api/libraries). If you want to search connected sources such as Google Drive or SharePoint, use [Connectors](/studio-api/connectors).

<SectionTab as="h1" sectionId="services">Services</SectionTab>

We provide two embedding models:

- [Text Embeddings](embeddings/text_embeddings): embed a wide variety of text with a general-purpose embedding model.
- [Code Embeddings](embeddings/code_embeddings): embed code databases and repositories for code retrieval.

We cover the fundamentals of the embeddings API, including how to measure the distance between text embeddings, and explore two main use cases: clustering and classification.

<SectionTab as="h2" variant="secondary" sectionId="services">More</SectionTab>
For a quick example and introduction on how to use embeddings for RAG, see [RAG Quickstart](/studio-api/knowledge-rag/rag_quickstart).