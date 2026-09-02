import { targetLocales } from "./route-utils";

type RedirectRule = {
  source: string;
  destination: string;
  permanent: boolean;
};

const rawRedirects: RedirectRule[] = [
  // ============================================================================
  // TEMPORARY REDIRECTS — REMOVE ONCE CDN/CLOUDFLARE REDIRECTS ARE LIVE
  // ----------------------------------------------------------------------------
  // Source: New_Public_Documentation_Redirections.csv (handed to SRE).
  // SRE is implementing these as 301s at the Cloudflare level; some are still
  // broken in the CDN, so we mirror them here as a fallback. Delete this whole
  // block once SRE confirms every entry is serving from the edge.
  //
  // Notes:
  // - CSV entry "/models/ → /models/model-cards/" intentionally OMITTED:
  //   `/models` is a real landing page in the app and Next.js trailing-slash
  //   normalization would turn that source into `/models`, clobbering the page.
  //   Keep this redirect at the CDN level only.
  // ============================================================================
  { source: "/getting-started/introduction", destination: "/", permanent: true },
  { source: "/getting-started/models", destination: "/models", permanent: true },
  { source: "/getting-started/models/compare", destination: "/inference/model-selection-guide", permanent: true },
  { source: "/models/model-cards/leanstral-1-5-26-06", destination: "/models/leanstral-1-5", permanent: true },
  { source: "/getting-started/quickstart", destination: "/getting-started/quickstarts", permanent: true },
  { source: "/getting-started/clients", destination: "/resources/sdks", permanent: true },
  { source: "/getting-started/changelog", destination: "/resources/changelogs", permanent: true },
  { source: "/capabilities/completion", destination: "/studio/conversations/chat-completion", permanent: true },
  { source: "/capabilities/completion/usage", destination: "/studio/conversations/chat-completion", permanent: true },
  { source: "/capabilities/completion/prompting_capabilities", destination: "/studio/conversations/chat-completion/prompting", permanent: true },
  { source: "/capabilities/completion/sampling", destination: "/inference/sampling", permanent: true },
  { source: "/capabilities/vision", destination: "/studio/conversations/vision", permanent: true },
  { source: "/capabilities/audio", destination: "/studio/audio/overview", permanent: true },
  { source: "/studio/audio", destination: "/studio/audio/overview", permanent: true },
  { source: "/capabilities/audio/speech_to_text", destination: "/studio/audio/speech_to_text", permanent: true },
  { source: "/capabilities/audio/speech_to_text/offline_transcription", destination: "/studio/audio/speech_to_text/offline_transcription", permanent: true },
  { source: "/capabilities/audio/speech_to_text/realtime_transcription", destination: "/studio/audio/speech_to_text/realtime_transcription", permanent: true },
  { source: "/capabilities/audio/text_to_speech", destination: "/studio/audio/text_to_speech", permanent: true },
  { source: "/capabilities/audio/text_to_speech/voices", destination: "/studio/audio/text_to_speech/voices", permanent: true },
  { source: "/capabilities/audio/text_to_speech/speech", destination: "/studio/audio/text_to_speech/speech", permanent: true },
  { source: "/capabilities/reasoning", destination: "/studio/conversations/reasoning", permanent: true },
  { source: "/capabilities/reasoning/adjustable", destination: "/studio/conversations/reasoning/adjustable", permanent: true },
  { source: "/capabilities/document_ai", destination: "/studio/document-processing/overview", permanent: true },
  { source: "/capabilities/document_ai/basic_ocr", destination: "/studio/document-processing/basic_ocr", permanent: true },
  { source: "/capabilities/document_ai/annotations", destination: "/studio/document-processing/annotations", permanent: true },
  { source: "/capabilities/document_ai/document_qna", destination: "/studio/document-processing/document_qna", permanent: true },
  { source: "/capabilities/code_generation", destination: "/vibe/code", permanent: true },
  { source: "/capabilities/embeddings", destination: "/studio/knowledge-rag/embeddings", permanent: true },
  { source: "/capabilities/function_calling", destination: "/studio/conversations/function-calling", permanent: true },
  { source: "/capabilities/citations", destination: "/studio/conversations/citations", permanent: true },
  { source: "/capabilities/structured_output", destination: "/studio/conversations/structured-output", permanent: true },
  { source: "/capabilities/structured_output/custom", destination: "/studio/conversations/structured-output/custom", permanent: true },
  { source: "/capabilities/structured_output/json_mode", destination: "/studio/conversations/structured-output/json_mode", permanent: true },
  { source: "/capabilities/guardrailing", destination: "/studio/conversations/moderation", permanent: true },
  { source: "/capabilities/batch", destination: "/studio/batch-processing", permanent: true },
  { source: "/capabilities/predicted_outputs", destination: "/studio/conversations/advanced/predicted-outputs", permanent: true },
  { source: "/capabilities/connectors", destination: "/studio/connectors", permanent: true },
  { source: "/capabilities/connectors/management", destination: "/studio/connectors/management", permanent: true },
  { source: "/capabilities/connectors/conversations", destination: "/studio/connectors/conversations", permanent: true },
  { source: "/capabilities/connectors/tool_calling", destination: "/studio/connectors/tool_calling", permanent: true },
  { source: "/capabilities/connectors/confirmation", destination: "/studio/connectors/confirmation", permanent: true },
  { source: "/capabilities/observability", destination: "/studio/observability", permanent: true },
  { source: "/capabilities/observability/quickstart", destination: "/studio/observability/quickstart", permanent: true },
  { source: "/capabilities/observability/explorer", destination: "/studio/observability/explorer", permanent: true },
  { source: "/capabilities/observability/judges", destination: "/studio/observability/judges", permanent: true },
  { source: "/capabilities/observability/campaigns", destination: "/studio/observability/campaigns", permanent: true },
  { source: "/capabilities/observability/datasets", destination: "/studio/observability/datasets", permanent: true },
  { source: "/agents/introduction", destination: "/studio/agents/introduction", permanent: true },
  { source: "/agents/agents", destination: "/studio/agents/agents-api", permanent: true },
  { source: "/agents/tools", destination: "/studio/agents/agent-tools", permanent: true },
  { source: "/agents/tools/built-in", destination: "/studio/agents/agent-tools", permanent: true },
  { source: "/agents/tools/built-in/websearch", destination: "/studio/agents/agent-tools/websearch", permanent: true },
  { source: "/agents/tools/built-in/code_interpreter", destination: "/studio/agents/agent-tools/code_interpreter", permanent: true },
  { source: "/agents/tools/built-in/image_generation", destination: "/studio/agents/agent-tools/image_generation", permanent: true },
  { source: "/agents/tools/built-in/document_library", destination: "/studio/search/libraries#connecting-libraries-to-agents", permanent: true },
  { source: "/agents/tools/mcp", destination: "/studio/connectors", permanent: true },
  { source: "/agents/tools/function_calling", destination: "/studio/agents/agent-tools/function-calling", permanent: true },
  { source: "/agents/handoffs", destination: "/studio/agents/handoffs", permanent: true },
  { source: "/deployment/ai-studio", destination: "/studio/overview", permanent: true },
  { source: "/deployment/cloud", destination: "/inference/deployment/cloud-deployments", permanent: true },
  { source: "/deployment/cloud/azure", destination: "/inference/deployment/cloud-deployments/azure", permanent: true },
  { source: "/deployment/cloud/amazon_bedrock", destination: "/inference/deployment/cloud-deployments/amazon_bedrock", permanent: true },
  { source: "/deployment/cloud/vertex", destination: "/inference/deployment/cloud-deployments/vertex", permanent: true },
  { source: "/deployment/cloud/sfcortex", destination: "/inference/deployment/cloud-deployments/sfcortex", permanent: true },
  { source: "/deployment/cloud/ibm-watsonx", destination: "/inference/deployment/cloud-deployments/ibm-watsonx", permanent: true },
  { source: "/deployment/cloud/outscale", destination: "/inference/deployment/cloud-deployments/outscale", permanent: true },
  { source: "/deployment/self-deployment", destination: "/inference/deployment/local-deployment", permanent: true },
  { source: "/deployment/self-deployment/vllm", destination: "/inference/deployment/local-deployment/vllm", permanent: true },
  { source: "/deployment/self-deployment/trt", destination: "/inference/deployment/local-deployment/trt", permanent: true },
  { source: "/deployment/self-deployment/skypilot", destination: "/inference/deployment/local-deployment/skypilot", permanent: true },
  { source: "/deployment/self-deployment/cerebrium", destination: "/inference/deployment/local-deployment/cerebrium", permanent: true },
  { source: "/deployment/self-deployment/cloudflare", destination: "/inference/deployment/local-deployment/cloudflare", permanent: true },
  { source: "/deployment/self-deployment/tgi", destination: "/inference/deployment/local-deployment/tgi", permanent: true },
  { source: "/workflows", destination: "/studio/workflows/getting-started/introduction", permanent: true },
  { source: "/workflows/getting-started/introduction", destination: "/studio/workflows/getting-started/introduction", permanent: true },
  { source: "/studio/workflows/getting-started/introduction", destination: "/studio/workflows/getting-started/overview", permanent: true },
  { source: "/workflows/getting-started/installation", destination: "/studio/workflows/getting-started/installation", permanent: true },
  { source: "/workflows/getting-started/your_first_workflow", destination: "/studio/workflows/getting-started/your_first_workflow", permanent: true },
  { source: "/workflows/getting-started/core_concepts/workflows", destination: "/studio/workflows/getting-started/core_concepts/workflows", permanent: true },
  { source: "/workflows/getting-started/core_concepts/activities", destination: "/studio/workflows/getting-started/core_concepts/activities", permanent: true },
  { source: "/workflows/getting-started/core_concepts/deployments", destination: "/studio/workflows/getting-started/core_concepts/deployments", permanent: true },
  { source: "/workflows/getting-started/core_concepts/executions", destination: "/studio/workflows/getting-started/core_concepts/executions", permanent: true },
  { source: "/workflows/getting-started/core_concepts/events", destination: "/studio/workflows/getting-started/core_concepts/events", permanent: true },
  { source: "/workflows/getting-started/core_concepts/workers", destination: "/studio/workflows/getting-started/core_concepts/workers", permanent: true },
  { source: "/workflows/building-workflows/workflows", destination: "/studio/workflows/building-workflows/workflows", permanent: true },
  { source: "/workflows/building-workflows/activities", destination: "/studio/workflows/building-workflows/activities", permanent: true },
  { source: "/workflows/building-workflows/activities/basics", destination: "/studio/workflows/building-workflows/activities/basics", permanent: true },
  { source: "/workflows/building-workflows/activities/local_activities", destination: "/studio/workflows/building-workflows/activities/local_activities", permanent: true },
  { source: "/workflows/building-workflows/activities/sticky_worker_sessions", destination: "/studio/workflows/building-workflows/activities/sticky_worker_sessions", permanent: true },
  { source: "/workflows/building-workflows/dependency_injection", destination: "/studio/workflows/building-workflows/dependency_injection", permanent: true },
  { source: "/workflows/building-workflows/workflow_exception", destination: "/studio/workflows/building-workflows/workflow_exception", permanent: true },
  { source: "/workflows/building-workflows/consuming_events", destination: "/studio/workflows/building-workflows/consuming_events", permanent: true },
  { source: "/workflows/building-workflows/streaming", destination: "/studio/workflows/building-workflows/streaming", permanent: true },
  { source: "/workflows/building-workflows/durable_agents", destination: "/studio/workflows/building-workflows/durable_agents", permanent: true },
  { source: "/workflows/building-workflows/scheduling", destination: "/studio/workflows/building-workflows/scheduling", permanent: true },
  { source: "/workflows/building-workflows/sub_workflows", destination: "/studio/workflows/building-workflows/sub_workflows", permanent: true },
  { source: "/workflows/building-workflows/waiting_for_conditions", destination: "/studio/workflows/building-workflows/waiting_for_conditions", permanent: true },
  { source: "/workflows/building-workflows/continue_as_new", destination: "/studio/workflows/building-workflows/continue_as_new", permanent: true },
  { source: "/workflows/interacting-with-workflows/signals", destination: "/studio/workflows/interacting-with-workflows/signals", permanent: true },
  { source: "/workflows/interacting-with-workflows/queries", destination: "/studio/workflows/interacting-with-workflows/queries", permanent: true },
  { source: "/workflows/interacting-with-workflows/updates", destination: "/studio/workflows/interacting-with-workflows/updates", permanent: true },
  { source: "/workflows/interacting-with-workflows/conversational_workflows", destination: "/studio/workflows/interacting-with-workflows/conversational_workflows", permanent: true },
  { source: "/workflows/managing-workflows-in-production/concurrency", destination: "/studio/workflows/managing-workflows-in-production/concurrency", permanent: true },
  { source: "/workflows/managing-workflows-in-production/rate_limiting", destination: "/studio/workflows/managing-workflows-in-production/rate_limiting", permanent: true },
  { source: "/workflows/managing-workflows-in-production/error_codes", destination: "/studio/workflows/managing-workflows-in-production/error_codes", permanent: true },
  { source: "/workflows/managing-workflows-in-production/deployments", destination: "/studio/workflows/managing-workflows-in-production/deployments", permanent: true },
  { source: "/workflows/managing-workflows-in-production/reset_workflow", destination: "/studio/workflows/managing-workflows-in-production/reset_workflow", permanent: true },
  { source: "/workflows/managing-workflows-in-production/execution_context", destination: "/studio/workflows/managing-workflows-in-production/execution_context", permanent: true },
  { source: "/workflows/observability", destination: "/studio/workflows/observability", permanent: true },
  { source: "/deprecated/customization", destination: "/resources/deprecated/customization", permanent: true },
  { source: "/deprecated/finetuning", destination: "/resources/deprecated/finetuning", permanent: true },
  { source: "/deprecated/finetuning/text_vision_finetuning", destination: "/resources/deprecated/finetuning/text_vision_finetuning", permanent: true },
  { source: "/deprecated/finetuning/classifier_factory", destination: "/resources/deprecated/finetuning/classifier_factory", permanent: true },
  { source: "/deprecated/guardrailing/mistral_moderation_2411", destination: "/resources/deprecated/guardrailing/mistral_moderation_2411", permanent: true },
  { source: "/deprecated/guardrailing/safe_prompt", destination: "/resources/deprecated/guardrailing/safe_prompt", permanent: true },
  // ============================================================================
  // Vibe restructure (2026-05-28): /mistral-vibe/* (previous production) and
  // legacy /vibe/vibe-code/* paths → new /vibe/code/* tree.
  // ============================================================================
  // Previous production /mistral-vibe/* → new /vibe/code/*
  {
    source: "/mistral-vibe",
    destination: "/vibe/code/overview",
    permanent: true,
  },
  {
    source: "/mistral-vibe/overview",
    destination: "/vibe/code/overview",
    permanent: true,
  },
  {
    source: "/mistral-vibe/terminal",
    destination: "/vibe/code/cli/install-setup",
    permanent: true,
  },
  {
    source: "/mistral-vibe/terminal/install",
    destination: "/vibe/code/cli/install-setup",
    permanent: true,
  },
  {
    source: "/mistral-vibe/terminal/quickstart",
    destination: "/vibe/code/cli/install-setup",
    permanent: true,
  },
  {
    source: "/mistral-vibe/terminal/configuration",
    destination: "/vibe/code/cli/configuration",
    permanent: true,
  },
  {
    source: "/mistral-vibe/local",
    destination: "/vibe/code/cli/offline-models",
    permanent: true,
  },
  {
    source: "/mistral-vibe/agents-skills",
    destination: "/vibe/code/cli/agents",
    permanent: true,
  },
  {
    source: "/mistral-vibe/using-fim-api/:path*",
    destination: "/vibe/code",
    permanent: true,
  },
  {
    source: "/mistral-vibe/using-fim-api",
    destination: "/vibe/code",
    permanent: true,
  },
  {
    source: "/mistral-vibe/introduction/:path*",
    destination: "/vibe/code/cli/install-setup",
    permanent: true,
  },
  {
    source: "/mistral-vibe/introduction",
    destination: "/vibe/code/cli/install-setup",
    permanent: true,
  },
  // Legacy /vibe/vibe-code/* (pre-mistral-vibe restructure) → /vibe/code/*
  {
    source: "/vibe/vibe-code/terminal/install",
    destination: "/vibe/code/cli/install-setup",
    permanent: true,
  },
  {
    source: "/vibe/vibe-code/terminal/quickstart",
    destination: "/vibe/code/cli/install-setup",
    permanent: true,
  },
  {
    source: "/vibe/vibe-code/terminal/configuration",
    destination: "/vibe/code/cli/configuration",
    permanent: true,
  },
  {
    source: "/vibe/vibe-code/terminal",
    destination: "/vibe/code/cli/install-setup",
    permanent: true,
  },
  {
    source: "/vibe/vibe-code/local/:path*",
    destination: "/vibe/code/cli/offline-models",
    permanent: true,
  },
  {
    source: "/vibe/vibe-code/agents-skills/:path*",
    destination: "/vibe/code/cli/agents",
    permanent: true,
  },
  {
    source: "/vibe/vibe-code/using-fim-api/:path*",
    destination: "/vibe/code",
    permanent: true,
  },
  {
    source: "/vibe/vibe-code",
    destination: "/vibe/code/overview",
    permanent: true,
  },
  {
    source: "/vibe/mistral-vibe",
    destination: "/vibe/code/overview",
    permanent: true,
  },
  // Vibe and Studio root cleanup
  { source: "/vibe/overview", destination: "/vibe", permanent: true },
  { source: "/studio-api/:path*", destination: "/studio/:path*", permanent: true },
  { source: "/studio-api", destination: "/studio", permanent: true },
  { source: "/studio/overview", destination: "/studio", permanent: true },
  // Category root URLs without a page.mdx (mirror _category_.json links)
  {
    source: "/vibe/work",
    destination: "/vibe/work/get-started",
    permanent: true,
  },
  {
    source: "/vibe/code",
    destination: "/vibe/code/overview",
    permanent: true,
  },
  {
    source: "/vibe/code/cli",
    destination: "/vibe/code/cli/install-setup",
    permanent: true,
  },
  {
    source: "/vibe/code/vs-code-extension",
    destination: "/vibe/code/vs-code-extension/install-authenticate",
    permanent: true,
  },
  {
    source: "/vibe/code/vibe-code-web",
    destination: "/vibe/code/vibe-code-web/get-started",
    permanent: true,
  },
  {
    source: "/vibe/chat-legacy",
    destination: "/vibe/chat-legacy/agents",
    permanent: true,
  },
  // Le Chat: Vibe Code Workflow article migrated to Vibe Code Web
  {
    source: "/le-chat/content-creation/vibe-code-workflow",
    destination: "/vibe/code/vibe-code-web/get-started",
    permanent: true,
  },
  {
    source: "/le-chat/content-creation/vibe-code-worfklow",
    destination: "/vibe/code/vibe-code-web/get-started",
    permanent: true,
  },
  // Le Chat → Vibe (full /le-chat/* tree moved to /vibe/work/* and /vibe/chat-legacy/*)
  {
    source: "/le-chat/conversation/chat",
    destination: "/vibe/work/get-started",
    permanent: true,
  },
  {
    source: "/le-chat/conversation/work-mode",
    destination: "/vibe/work/get-started",
    permanent: true,
  },
  {
    source: "/le-chat/conversation/voice-mode",
    destination: "/vibe/work/voice-mode",
    permanent: true,
  },
  {
    source: "/le-chat/conversation/think-mode",
    destination: "/vibe/chat-legacy/think-mode",
    permanent: true,
  },
  {
    source: "/le-chat/content-creation/canvas",
    destination: "/vibe/work/files-and-canvas",
    permanent: true,
  },
  {
    source: "/le-chat/content-creation/code-interpreter",
    destination: "/vibe/chat-legacy/code-interpreter",
    permanent: true,
  },
  {
    source: "/le-chat/content-creation/image-generation",
    destination: "/vibe/work/image-generation",
    permanent: true,
  },
  {
    source: "/le-chat/research-analysis/open-url",
    destination: "/vibe/work/web-search-open-url",
    permanent: true,
  },
  {
    source: "/le-chat/research-analysis/web-search",
    destination: "/vibe/work/web-search-open-url",
    permanent: true,
  },
  {
    source: "/le-chat/research-analysis/deep-research",
    destination: "/vibe/chat-legacy/deep-research",
    permanent: true,
  },
  {
    source: "/le-chat/research-analysis/files-upload",
    destination: "/vibe/work/files-and-canvas",
    permanent: true,
  },
  {
    source: "/le-chat/knowledge-integrations/connectors/mcp-connectors",
    destination: "/vibe/work/connectors/mcp-connectors",
    permanent: true,
  },
  {
    source: "/le-chat/knowledge-integrations/connectors/knowledge-connectors",
    destination: "/vibe/work/connectors",
    permanent: true,
  },
  {
    source: "/vibe/work/connectors/knowledge-connectors",
    destination: "/vibe/work/connectors",
    permanent: true,
  },
  {
    source: "/le-chat/knowledge-integrations/connectors",
    destination: "/vibe/work/connectors",
    permanent: true,
  },
  {
    source: "/le-chat/knowledge-integrations/projects",
    destination: "/vibe/work/projects",
    permanent: true,
  },
  {
    source: "/le-chat/knowledge-integrations/libraries",
    destination: "/vibe/work/libraries",
    permanent: true,
  },
  {
    source: "/le-chat/knowledge-integrations/agents",
    destination: "/vibe/chat-legacy/agents",
    permanent: true,
  },
  {
    source: "/le-chat/knowledge-integrations/custom-instructions",
    destination: "/vibe/work/custom-instructions",
    permanent: true,
  },
  {
    source: "/le-chat/knowledge-integrations/memories",
    destination: "/vibe/chat-legacy/memories",
    permanent: true,
  },
  {
    source: "/le-chat/overview",
    destination: "/vibe/work/get-started",
    permanent: true,
  },
  {
    source: "/le-chat/:path*",
    destination: "/vibe/work/get-started",
    permanent: true,
  },
  {
    source: "/le-chat",
    destination: "/vibe/work/get-started",
    permanent: true,
  },
  // Guide redirects
  {
    source: "/guides/tokenization",
    destination: "/resources/cookbooks/concept-deep-dive-tokenization-readme",
    permanent: true,
  },
  {
    source: "/guides/evaluation",
    destination: "/inference/prompting",
    permanent: true,
  },
  {
    source: "/guides/contribute/overview",
    destination: "/getting-started",
    permanent: true,
  },
  {
    source: "/guides/rag",
    destination: "/studio/knowledge-rag/rag_quickstart",
    permanent: true,
  },
  {
    source: "/guides/sampling",
    destination: "/inference/sampling",
    permanent: true,
  },
  {
    source: "/guides/contribute/ambassador",
    destination: "/resources/ambassadors",
    permanent: true,
  },
  {
    source: "/guides/finetuning",
    destination: "/resources/deprecated/finetuning",
    permanent: true,
  },
  {
    source: "/guides/prompting_capabilities",
    destination: "/inference/prompting",
    permanent: true,
  },
  {
    source: "/guides/function-calling",
    destination: "/studio/conversations/function-calling",
    permanent: true,
  },
  {
    source: "/guides/embeddings",
    destination: "/studio/knowledge-rag/embeddings",
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
    destination: "/studio/knowledge-rag/rag_quickstart",
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
    source: "/products/models/:path*",
    destination: "/models/:path*",
    permanent: true,
  },
  {
    source: "/products/:path*",
    destination: "/getting-started/platform-overview",
    permanent: true,
  },
  {
    source: "/products",
    destination: "/getting-started/platform-overview",
    permanent: true,
  },
  {
    source: "/getting-started/models/models_overview",
    destination: "/models",
    permanent: true,
  },
  {
    source: "/getting-started/models/benchmark",
    destination: "/models",
    permanent: true,
  },
  {
    source: "/getting-started/models",
    destination: "/models",
    permanent: true,
  },
  // Chat completion flatten
  {
    source: "/studio/conversations/chat-completion/usage",
    destination: "/studio/conversations/chat-completion",
    permanent: true,
  },
  // Capabilities redirects
  {
    source: "/capabilities/document_ai/document_ai_overview",
    destination: "/studio/document-processing/overview",
    permanent: true,
  },
  {
    source: "/capabilities/document_ai/:path*",
    destination: "/studio/document-processing/:path*",
    permanent: true,
  },
  {
    source: "/capabilities/fim",
    destination: "/vibe/code",
    permanent: true,
  },
  {
    source: "/capabilities/structured-output/custom_structured_output",
    destination: "/studio/conversations/structured-output",
    permanent: true,
  },
  {
    source: "/capabilities/structured_output/:path*",
    destination: "/studio/conversations/structured-output",
    permanent: true,
  },

  {
    source: "/capabilities/audio_transcription",
    destination: "/studio/audio/speech_to_text",
    permanent: true,
  },
  {
    source: "/capabilities/completion/:path*",
    destination: "/studio/conversations/chat-completion",
    permanent: true,
  },
  {
    source: "/capabilities/embeddings/:path*",
    destination: "/studio/knowledge-rag/embeddings",
    permanent: true,
  },
  {
    source: "/studio/knowledge-rag/embeddings/rag_quickstart",
    destination: "/studio/knowledge-rag/rag_quickstart",
    permanent: true,
  },
  {
    source: "/studio/knowledge-rag/connectors",
    destination: "/studio/connectors",
    permanent: true,
  },
  {
    source: "/studio/knowledge-rag/connectors/management",
    destination: "/studio/connectors/management",
    permanent: true,
  },
  {
    source: "/studio/knowledge-rag/connectors/playground",
    destination: "/studio/connectors/debugger",
    permanent: true,
  },
  {
    source: "/studio/knowledge-rag/connectors/debugger",
    destination: "/studio/connectors/debugger",
    permanent: true,
  },
  {
    source: "/studio/knowledge-rag/connectors/conversations",
    destination: "/studio/connectors/conversations",
    permanent: true,
  },
  {
    source: "/studio/knowledge-rag/connectors/tool_calling",
    destination: "/studio/connectors/tool_calling",
    permanent: true,
  },
  {
    source: "/studio/knowledge-rag/connectors/confirmation",
    destination: "/studio/connectors/confirmation",
    permanent: true,
  },
  {
    source: "/capabilities/finetuning/:path*",
    destination: "/resources/deprecated/finetuning",
    permanent: true,
  },
  {
    source: "/capabilities/agents",
    destination: "/studio/agents/introduction",
    permanent: true,
  },
  {
    source: "/capabilities/code_generation/:path*",
    destination: "/vibe/code/overview",
    permanent: true,
  },
  // Built-in tools flatten
  {
    source: "/studio/agents/agents-tooling/built-in/:path*",
    destination: "/studio/agents/agent-tools/:path*",
    permanent: true,
  },
  {
    source: "/studio/agents/agents-tooling/built-in",
    destination: "/studio/agents/agent-tools",
    permanent: true,
  },
  // Tools redirects
  {
    source: "/tools/bult-in/websearch",
    destination: "/studio/agents/agent-tools/websearch",
    permanent: true,
  },
  {
    source: "/agents/mcp",
    destination: "/studio/connectors",
    permanent: true,
  },
  {
    source: "/agents/tools/mcp",
    destination: "/studio/connectors",
    permanent: true,
  },
  {
    source: "/studio/agents/agents-tooling/mcp",
    destination: "/studio/connectors",
    permanent: true,
  },
  {
    source: "/agents/tools/built-in/:path*",
    destination: "/studio/agents/agent-tools/:path*",
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
    source: "/cookbook",
    destination: "/resources/cookbooks",
    permanent: true,
  },
  // Agents redirects
  {
    source: "/agents/connectors/image_generation",
    destination: "/studio/agents/agent-tools/image_generation",
    permanent: true,
  },
  {
    source: "/agents/connectors/websearch",
    destination: "/studio/agents/agent-tools/websearch",
    permanent: true,
  },
  {
    source: "/agents/introduction",
    destination: "/studio/agents/introduction",
    permanent: true,
  },
  // OCR
  {
    source: "/capabilities/OCR/basic_ocr",
    destination: "/studio/document-processing/basic_ocr",
    permanent: true,
  },
  {
    source: "/capabilities/OCR/annotations",
    destination: "/studio/document-processing/annotations",
    permanent: true,
  },
  {
    source: "/capabilities/OCR/document_qna",
    destination: "/studio/document-processing/document_qna",
    permanent: true,
  },
  {
    source: "/capabilities/OCR/document_understanding",
    destination: "/studio/document-processing/overview",
    permanent: true,
  },
  // Optimization flatten
  {
    source: "/studio/optimization/batches",
    destination: "/studio/batch-processing",
    permanent: true,
  },
  {
    source: "/studio/optimization",
    destination: "/studio/batch-processing",
    permanent: true,
  },
  // Inference IA revamp
  { source: "/models/overview", destination: "/models", permanent: true },
  { source: "/models/model-selection-guide", destination: "/inference/model-selection-guide", permanent: true },
  { source: "/models/model-lifecycle", destination: "/inference/model-lifecycle", permanent: true },
  { source: "/models/best-practices/prompt-engineering", destination: "/inference/prompting", permanent: true },
  { source: "/models/best-practices/sampling", destination: "/inference/sampling", permanent: true },
  { source: "/models/best-practices", destination: "/inference/prompting", permanent: true },
  { source: "/models/labs", destination: "/inference/labs", permanent: true },
  { source: "/models/deployment/:path*", destination: "/inference/deployment/:path*", permanent: true },
  { source: "/models/deployment", destination: "/inference/deployment", permanent: true },
  { source: "/models/model-cards/:path*", destination: "/models/:path*", permanent: true },
  { source: "/models/pricing", destination: "/inference/pricing", permanent: true },
  { source: "/studio-api/priority-tier", destination: "/inference/priority-tier", permanent: true },
  { source: "/studio/priority-tier", destination: "/inference/priority-tier", permanent: true },
  { source: "/studio/regional-inference", destination: "/inference/regional-inference", permanent: true },
  { source: "/community/ambassadors", destination: "/resources/ambassadors", permanent: true },
  // Models
  {
    source: "/models/best-practices/advanced-techniques/tokenization-sampling",
    destination: "/inference/sampling",
    permanent: true,
  },
  {
    source: "/models/best-practices/advanced-techniques",
    destination: "/inference/prompting",
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
    destination: "/inference/deployment/cloud-deployments/amazon_bedrock",
    permanent: true,
  },
  {
    source: "/deployment/cloud/:path*",
    destination: "/inference/deployment/cloud-deployments/:path*",
    permanent: true,
  },
  {
    source: "/deployment/ai-studio/:path*",
    destination: "/admin/billing-usage/:path*",
    permanent: true,
  },
  // Admin section restructure (2026): old security-access / user-management-finops / admin-api paths
  {
    source: "/admin/security-access/admin-api",
    destination: "/admin/admin-api/overview",
    permanent: true,
  },
  {
    source: "/admin/automate-administration/overview",
    destination: "/admin/admin-api/overview",
    permanent: true,
  },
  {
    source: "/admin/automate-administration/authentication",
    destination: "/admin/admin-api/authentication",
    permanent: true,
  },
  {
    source: "/admin/automate-administration/manage-users",
    destination: "/admin/admin-api/manage-users",
    permanent: true,
  },
  {
    source: "/admin/automate-administration/manage-workspaces",
    destination: "/admin/admin-api/manage-workspaces",
    permanent: true,
  },
  {
    source: "/admin/automate-administration/manage-groups-roles",
    destination: "/admin/admin-api/manage-groups-roles",
    permanent: true,
  },
  {
    source: "/admin/automate-administration/user-provisioning",
    destination: "/admin/admin-api/user-provisioning",
    permanent: true,
  },
  {
    source: "/admin/automate-administration/usage-metrics",
    destination: "/admin/admin-api/usage-metrics",
    permanent: true,
  },
  {
    source: "/admin/automate-administration/api-reference",
    destination: "/admin/admin-api/api-reference",
    permanent: true,
  },
  {
    source: "/admin/security-access/back-office",
    destination: "/admin/overview",
    permanent: true,
  },
  {
    source: "/admin/set-up-organization/admin-panel",
    destination: "/admin/overview",
    permanent: true,
  },
  {
    source: "/admin/security-access/email-domain-auth",
    destination: "/admin/set-up-organization/sign-in-method/email-domain-authentication",
    permanent: true,
  },
  {
    source: "/admin/security-access/sso",
    destination: "/admin/set-up-organization/sign-in-method/saml-sso",
    permanent: true,
  },
  {
    source: "/admin/security-access/api-keys",
    destination: "/admin/identity-access/api-keys",
    permanent: true,
  },
  {
    source: "/admin/security-access/connectors",
    destination: "/admin/identity-access/connectors",
    permanent: true,
  },
  {
    source: "/admin/security-access/organization",
    destination: "/admin/workspaces/your-first-workspace",
    permanent: true,
  },
  {
    source: "/admin/security-access/audit-logs",
    destination: "/admin/monitor-comply/audit-logs/overview",
    permanent: true,
  },
  {
    source: "/admin/monitor-comply/audit-logs",
    destination: "/admin/monitor-comply/audit-logs/overview",
    permanent: true,
  },
  {
    source: "/admin/security-access/privacy",
    destination: "/admin/monitor-comply/privacy-data-controls",
    permanent: true,
  },
  {
    source: "/admin/workspaces/usage-limits-by-workspace",
    destination: "/admin/workspaces/usage-limits",
    permanent: true,
  },
  {
    source: "/admin/quickstarts/create-organization",
    destination: "/getting-started/quickstarts/admin/create-organization",
    permanent: true,
  },
  {
    source: "/admin/quickstarts/configure-sso",
    destination: "/getting-started/quickstarts/admin/configure-sso",
    permanent: true,
  },
  {
    source: "/admin/quickstarts/manage-workspaces",
    destination: "/getting-started/quickstarts/admin/manage-workspaces",
    permanent: true,
  },
  {
    source: "/admin/quickstarts",
    destination: "/getting-started/quickstarts/admin",
    permanent: true,
  },
  {
    source: "/admin/user-management-finops/user-management",
    destination: "/admin/identity-access/user-management",
    permanent: true,
  },
  {
    source: "/admin/user-management-finops/user-groups",
    destination: "/admin/identity-access/groups",
    permanent: true,
  },
  {
    source: "/admin/user-management-finops/subscriptions",
    destination: "/admin/billing-usage/subscriptions",
    permanent: true,
  },
  {
    source: "/admin/user-management-finops/billing",
    destination: "/admin/billing-usage/billing",
    permanent: true,
  },
  {
    source: "/admin/user-management-finops/usage-limits",
    destination: "/admin/billing-usage/usage-limits",
    permanent: true,
  },
  {
    source: "/admin/user-management-finops/tier",
    destination: "/admin/billing-usage/usage-limits",
    permanent: true,
  },
  {
    source: "/admin/billing-usage/usage-dashboard",
    destination: "/admin/billing-usage/usage-limits",
    permanent: true,
  },
  {
    source: "/admin/billing-usage/rate-limits-usage-tiers",
    destination: "/admin/billing-usage/usage-limits",
    permanent: true,
  },
  // Developer IA has moved into Resources.
  {
    source: "/developers",
    destination: "/resources",
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
    source: "/getting-started/glossary",
    destination: "/resources/glossary",
    permanent: true,
  },
  // Platform overview rename: le-chat-studio-admin -> platform-overview
  {
    source: "/getting-started/le-chat-studio-admin",
    destination: "/getting-started/platform-overview",
    permanent: true,
  },
  {
    source: "/getting-started/platform-overview/vibe",
    destination: "/getting-started/platform-overview",
    permanent: true,
  },
  {
    source: "/getting-started/platform-overview/tiers-and-editions",
    destination: "/getting-started/platform-overview",
    permanent: true,
  },
  // Studio workflows: publish_in_le_chat folder renamed to publish_in_vibe
  {
    source: "/studio/workflows/interacting-with-workflows/conversational_workflows/publish_in_le_chat",
    destination: "/studio/workflows/interacting-with-workflows/conversational_workflows/publish_in_vibe",
    permanent: true,
  },
  // Quickstart category indexes removed: all roll up to the home page (/) Quickstarts section
  {
    source: "/getting-started/quickstarts",
    destination: "/",
    permanent: true,
  },
  {
    source: "/getting-started/quickstarts/vibe-work",
    destination: "/",
    permanent: true,
  },
  {
    source: "/getting-started/quickstarts/vibe-code",
    destination: "/",
    permanent: true,
  },
  {
    source: "/getting-started/quickstarts/studio",
    destination: "/",
    permanent: true,
  },
  {
    source: "/getting-started/quickstarts/developer",
    destination: "/",
    permanent: true,
  },
  {
    source: "/getting-started/quickstarts/admin",
    destination: "/",
    permanent: true,
  },
  // Quickstart restructure: le-chat -> vibe-work, vibe -> vibe-code
  {
    source: "/getting-started/quickstarts/le-chat",
    destination: "/",
    permanent: true,
  },
  {
    source: "/getting-started/quickstarts/le-chat/draft-research-report",
    destination: "/getting-started/quickstarts/vibe-work/first-task",
    permanent: true,
  },
  {
    source: "/getting-started/quickstarts/vibe-work/draft-research-report",
    destination: "/getting-started/quickstarts/vibe-work/first-task",
    permanent: true,
  },
  {
    source: "/getting-started/quickstarts/le-chat/analyze-data",
    destination: "/getting-started/quickstarts/vibe-work/analyze-data",
    permanent: true,
  },
  {
    source: "/getting-started/quickstarts/le-chat/create-custom-agent",
    destination: "/getting-started/quickstarts/vibe-work/create-first-skill",
    permanent: true,
  },
  {
    source: "/getting-started/quickstarts/vibe",
    destination: "/",
    permanent: true,
  },
  {
    source: "/getting-started/quickstarts/vibe/install-and-first-prompt",
    destination: "/getting-started/quickstarts/vibe-code/install-cli",
    permanent: true,
  },
  {
    source: "/getting-started/quickstarts/vibe/scaffold-a-project",
    destination: "/getting-started/quickstarts/vibe-code/scaffold-a-project",
    permanent: true,
  },
  {
    source: "/models/overview/compare",
    destination: "/inference/model-selection-guide",
    permanent: true,
  },
  // ============================================================================
  // SEARCH REGROUPING REDIRECTS — old paths moved under /studio/search/
  // ============================================================================
  { source: "/studio/search-toolkit", destination: "/studio/search/search-toolkit", permanent: true },
  { source: "/studio/search-toolkit/:path*", destination: "/studio/search/search-toolkit/:path*", permanent: true },
  {
    source: "/studio/search/search-toolkit/document-model",
    destination: "/studio/search/search-toolkit/concepts/document-model",
    permanent: true,
  },
  {
    source: "/studio/search/search-toolkit/vespa",
    destination: "/studio/search/search-toolkit/search-index/vespa",
    permanent: true,
  },
  {
    source: "/studio/search/search-toolkit/vespa/:path*",
    destination: "/studio/search/search-toolkit/search-index/vespa/:path*",
    permanent: true,
  },
  { source: "/studio/libraries", destination: "/studio/search/libraries", permanent: true },
  { source: "/studio/libraries/:path*", destination: "/studio/search/libraries/:path*", permanent: true },
];

// Locale-prefix every rule for target locales so e.g. /fr/old redirects to
// /fr/new. The default locale remains unprefixed.
const LOCALE_PREFIX = `/:locale(${targetLocales.join("|")})`;

const isExternalDestination = (destination: string) => /^https?:\/\//.test(destination);

const localeAwareLegacyRedirects = rawRedirects.map(rule => ({
  ...rule,
  source: `${LOCALE_PREFIX}${rule.source}`,
  destination: isExternalDestination(rule.destination)
    ? rule.destination
    : `${LOCALE_PREFIX}${rule.destination}`,
}));

export const redirects = [
  ...rawRedirects,
  ...localeAwareLegacyRedirects,
];
