export const redirects = [
  // Old /vibe/mistral-vibe/ → new /mistral-vibe/
  {
    source: "/vibe/mistral-vibe/:path*",
    destination: "/mistral-vibe/:path*",
    permanent: true,
  },
  {
    source: "/vibe/mistral-vibe",
    destination: "/mistral-vibe/overview",
    permanent: true,
  },
  {
    source: "/vibe",
    destination: "/mistral-vibe/overview",
    permanent: true,
  },
  // Vibe Code → Mistral Vibe restructure
  {
    source: "/vibe/vibe-code/terminal/:path*",
    destination: "/mistral-vibe/terminal/:path*",
    permanent: true,
  },
  {
    source: "/vibe/vibe-code/agents-skills/:path*",
    destination: "/mistral-vibe/agents-skills/:path*",
    permanent: true,
  },
  {
    source: "/vibe/vibe-code/local/:path*",
    destination: "/mistral-vibe/local/:path*",
    permanent: true,
  },
  {
    source: "/vibe/vibe-code/using-fim-api/:path*",
    destination: "/mistral-vibe/using-fim-api/:path*",
    permanent: true,
  },
  {
    source: "/vibe/vibe-code",
    destination: "/mistral-vibe/overview",
    permanent: true,
  },
  // External links: /mistral-vibe/introduction → /mistral-vibe/terminal
  {
    source: "/mistral-vibe/introduction/:path*",
    destination: "/mistral-vibe/terminal/:path*",
    permanent: true,
  },
  {
    source: "/mistral-vibe/introduction",
    destination: "/mistral-vibe/terminal",
    permanent: true,
  },
  // Le Chat root → overview (landing page moved to /products)
  {
    source: "/le-chat",
    destination: "/le-chat/overview",
    permanent: false,
  },
  // Guide redirects
  {
    source: "/guides/tokenization",
    destination: "/resources/cookbooks/concept-deep-dive-tokenization-readme",
    permanent: true,
  },
  {
    source: "/guides/evaluation",
    destination: "/models/best-practices",
    permanent: true,
  },
  {
    source: "/guides/contribute/overview",
    destination: "/getting-started",
    permanent: true,
  },
  {
    source: "/guides/rag",
    destination: "/studio-api/knowledge-rag",
    permanent: true,
  },
  {
    source: "/guides/sampling",
    destination: "/models/best-practices/sampling",
    permanent: true,
  },
  {
    source: "/guides/contribute/ambassador",
    destination: "/ambassadors",
    permanent: true,
  },
  {
    source: "/guides/observability",
    destination: "/studio-api/classifiers-moderations",
    permanent: true,
  },
  // Observability flatten
  {
    source: "/studio-api/observability/classifiers-moderations",
    destination: "/studio-api/classifiers-moderations",
    permanent: true,
  },
  {
    source: "/guides/finetuning",
    destination: "/resources/deprecated/finetuning",
    permanent: true,
  },
  {
    source: "/guides/prompting_capabilities",
    destination: "/models/best-practices/prompt-engineering",
    permanent: true,
  },
  {
    source: "/guides/resources",
    destination: "/getting-started",
    permanent: true,
  },
  {
    source: "/guides/prefix",
    destination: "/resources/cookbooks/mistral-prompting-prefix_use_cases",
    permanent: true,
  },
  {
    source: "/guides/basic-RAG",
    destination: "/studio-api/knowledge-rag",
    permanent: true,
  },
  // Getting started redirects
  {
    source: "/getting-started/stories",
    destination: "/resources/deprecated/customization",
    permanent: true,
  },
  {
    source: '/deployment/laplateforme/pricing',
    destination: 'https://mistral.ai/pricing',
    permanent: true,
  },
  {
    source: "/getting-started/pricing",
    destination: "https://mistral.ai/pricing",
    permanent: true,
  },
  // /products/* redirects (flattened structure)
  {
    source: "/products/vibe/:path*",
    destination: "/mistral-vibe/:path*",
    permanent: true,
  },
  {
    source: "/products/studio-api/:path*",
    destination: "/studio-api/:path*",
    permanent: true,
  },
  {
    source: "/products/models/:path*",
    destination: "/models/:path*",
    permanent: true,
  },
  {
    source: "/getting-started/models/models_overview",
    destination: "/models/overview",
    permanent: true,
  },
  {
    source: "/getting-started/models/benchmark",
    destination: "/models/overview",
    permanent: true,
  },
  {
    source: "/getting-started/models",
    destination: "/models",
    permanent: true,
  },
  // Chat completion flatten
  {
    source: "/studio-api/conversations/chat-completion/usage",
    destination: "/studio-api/conversations/chat-completion",
    permanent: true,
  },
  // Capabilities redirects
  {
    source: "/capabilities/document_ai/document_ai_overview",
    destination: "/studio-api/data-ingestion/document-intelligence",
    permanent: true,
  },
  {
    source: "/capabilities/document_ai/:path*",
    destination: "/studio-api/data-ingestion/document-intelligence/:path*",
    permanent: true,
  },
  {
    source: "/capabilities/fim",
    destination: "/mistral-vibe/using-fim-api",
    permanent: true,
  },
  {
    source: "/capabilities/structured-output/custom_structured_output",
    destination: "/studio-api/conversations/structured-output",
    permanent: true,
  },
  {
    source: "/capabilities/structured_output/:path*",
    destination: "/studio-api/conversations/structured-output",
    permanent: true,
  },
  {
    source: "/studio-api/conversations/structured-output/custom",
    destination: "/studio-api/conversations/structured-output",
    permanent: true,
  },
  {
    source: "/studio-api/conversations/structured-output/json_mode",
    destination: "/studio-api/conversations/structured-output",
    permanent: true,
  },
  {
    source: "/capabilities/audio",
    destination: "/studio-api/data-ingestion/audio-transcriptions",
    permanent: true,
  },
  {
    source: "/capabilities/audio_transcription",
    destination: "/studio-api/data-ingestion/audio-transcriptions",
    permanent: true,
  },
  {
    source: "/capabilities/completion/:path*",
    destination: "/studio-api/conversations/chat-completion",
    permanent: true,
  },
  {
    source: "/capabilities/embeddings/:path*",
    destination: "/studio-api/knowledge-rag/embeddings",
    permanent: true,
  },
  {
    source: "/studio-api/knowledge-rag/embeddings/text_embeddings",
    destination: "/studio-api/knowledge-rag/embeddings#text-embeddings",
    permanent: true,
  },
  {
    source: "/studio-api/knowledge-rag/embeddings/code_embeddings",
    destination: "/studio-api/knowledge-rag/embeddings#code-embeddings",
    permanent: true,
  },
  {
    source: "/studio-api/knowledge-rag/embeddings/rag_quickstart",
    destination: "/studio-api/knowledge-rag/rag_quickstart",
    permanent: true,
  },
  {
    source: "/capabilities/finetuning/:path*",
    destination: "/resources/deprecated/finetuning",
    permanent: true,
  },
  {
    source: "/capabilities/agents",
    destination: "/studio-api/agents/introduction",
    permanent: true,
  },
  {
    source: "/capabilities/code_generation/:path*",
    destination: "/mistral-vibe/overview",
    permanent: true,
  },
  // Built-in tools flatten
  {
    source: "/studio-api/agents/agents-tooling/built-in/:path*",
    destination: "/studio-api/agents/agents-tooling/:path*",
    permanent: true,
  },
  {
    source: "/studio-api/agents/agents-tooling/built-in",
    destination: "/studio-api/agents/agents-tooling",
    permanent: true,
  },
  // Tools redirects
  {
    source: "/tools/bult-in/websearch",
    destination: "/studio-api/agents/agents-tooling/websearch",
    permanent: true,
  },
  {
    source: "/agents/mcp",
    destination: "/studio-api/knowledge-rag/connectors-mcp",
    permanent: true,
  },
  {
    source: "/agents/tools/mcp",
    destination: "/studio-api/knowledge-rag/connectors-mcp",
    permanent: true,
  },
  {
    source: "/studio-api/agents/agents-tooling/mcp",
    destination: "/studio-api/knowledge-rag/connectors-mcp",
    permanent: true,
  },
  {
    source: "/agents/tools/built-in/:path*",
    destination: "/studio-api/agents/agents-tooling/:path*",
    permanent: true,
  },
  // News redirects
  {
    source: "/news/magistral-series-reasoning-llms",
    destination: "https://mistral.ai/fr/news/magistral",
    permanent: true,
  },
  // Cookbooks redirects
  {
    source: "/cookbooks",
    destination: "/resources/cookbooks",
    permanent: true,
  },
  {
    source: "/cookbooks/:path*",
    destination: "/resources/cookbooks/:path*",
    permanent: true,
  },
  {
    source: "/cookbook/image.png",
    destination: "/resources/cookbooks",
    permanent: true,
  },
  {
    source: "/cookbook/",
    destination: "/resources/cookbooks",
    permanent: true,
  },
  // Agents redirects
  {
    source: "/agents/connectors/image_generation",
    destination: "/studio-api/agents/agents-tooling/image_generation",
    permanent: true,
  },
  {
    source: "/agents/connectors/websearch",
    destination: "/studio-api/agents/agents-tooling/websearch",
    permanent: true,
  },
  {
    source: "/agents/introduction",
    destination: "/studio-api/agents/introduction",
    permanent: true,
  },
  // OCR
  {
    source: "/capabilities/OCR/basic_ocr",
    destination: "/studio-api/data-ingestion/document-intelligence/basic_ocr",
    permanent: true,
  },
  // Optimization flatten
  {
    source: "/studio-api/optimization/batches",
    destination: "/studio-api/batch-processing",
    permanent: true,
  },
  {
    source: "/studio-api/optimization",
    destination: "/studio-api/batch-processing",
    permanent: true,
  },
  // Models
  {
    source: "/models/best-practices/advanced-techniques/tokenization-sampling",
    destination: "/models/best-practices/sampling",
    permanent: true,
  },
  {
    source: "/models/best-practices/advanced-techniques",
    destination: "/models/best-practices",
    permanent: true,
  },
  {
    source: "/models/customization",
    destination: "/resources/deprecated/customization",
    permanent: true,
  },
  {
    source: "/getting-started/open_weight_models",
    destination: "/models",
    permanent: true,
  },
  {
    source: "/platform/endpoints",
    destination: "/models",
    permanent: true,
  },
  // Cloud
  {
    source: "/deployment/cloud/aws",
    destination: "/models/deployment/cloud-deployments/amazon_bedrock",
    permanent: true,
  },
  {
    source: "/deployment/cloud/:path*",
    destination: "/models/deployment/cloud-deployments/:path*",
    permanent: true,
  },
  {
    source: "/deployment/ai-studio/:path*",
    destination: "/admin/user-management-finops/:path*",
    permanent: true,
  },
  // Old getting-started structure redirects
  {
    source: "/getting-started/introduction",
    destination: "/",
    permanent: true,
  },
  {
    source: "/getting-started/customization/:path*",
    destination: "/resources/deprecated/customization",
    permanent: true,
  },
  {
    source: "/getting-started/changelog",
    destination: "/resources/changelogs",
    permanent: true,
  },
  {
    source: "/getting-started/platform-overview/vibe",
    destination: "/getting-started/vibe-studio-admin",
    permanent: true,
  },
  {
    source: "/getting-started/platform-overview/tiers-and-editions",
    destination: "/getting-started/vibe-studio-admin",
    permanent: true,
  },
  {
    source: "/getting-started/platform-overview",
    destination: "/getting-started/vibe-studio-admin",
    permanent: true,
  },
  {
    source: "/models/overview/compare",
    destination: "/models/model-selection-guide",
    permanent: true,
  },
]
