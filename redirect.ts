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
  { source: "/getting-started/models", destination: "/models/overview", permanent: true },
  { source: "/getting-started/models/compare", destination: "/models/model-selection-guide", permanent: true },
  { source: "/models/codestral-24-05", destination: "/models/model-cards/codestral-24-05", permanent: true },
  { source: "/models/codestral-25-01", destination: "/models/model-cards/codestral-25-01", permanent: true },
  { source: "/models/codestral-25-08", destination: "/models/model-cards/codestral-25-08", permanent: true },
  { source: "/models/codestral-embed-25-05", destination: "/models/model-cards/codestral-embed-25-05", permanent: true },
  { source: "/models/codestral-mamba-7b-0-1", destination: "/models/model-cards/codestral-mamba-7b-0-1", permanent: true },
  { source: "/models/devstral-2-25-12", destination: "/models/model-cards/devstral-2-25-12", permanent: true },
  { source: "/models/devstral-medium-1-0-25-07", destination: "/models/model-cards/devstral-medium-1-0-25-07", permanent: true },
  { source: "/models/devstral-small-1-0-25-05", destination: "/models/model-cards/devstral-small-1-0-25-05", permanent: true },
  { source: "/models/devstral-small-1-1-25-07", destination: "/models/model-cards/devstral-small-1-1-25-07", permanent: true },
  { source: "/models/devstral-small-2-25-12", destination: "/models/model-cards/devstral-small-2-25-12", permanent: true },
  { source: "/models/leanstral-26-03", destination: "/models/model-cards/leanstral-26-03", permanent: true },
  { source: "/models/magistral-medium-1-0-25-06", destination: "/models/model-cards/magistral-medium-1-0-25-06", permanent: true },
  { source: "/models/magistral-medium-1-1-25-07", destination: "/models/model-cards/magistral-medium-1-1-25-07", permanent: true },
  { source: "/models/magistral-medium-1-2-25-09", destination: "/models/model-cards/magistral-medium-1-2-25-09", permanent: true },
  { source: "/models/magistral-small-1-0-25-06", destination: "/models/model-cards/magistral-small-1-0-25-06", permanent: true },
  { source: "/models/magistral-small-1-1-25-07", destination: "/models/model-cards/magistral-small-1-1-25-07", permanent: true },
  { source: "/models/magistral-small-1-2-25-09", destination: "/models/model-cards/magistral-small-1-2-25-09", permanent: true },
  { source: "/models/mathstral-7b-0-1", destination: "/models/model-cards/mathstral-7b-0-1", permanent: true },
  { source: "/models/ministral-3-14b-25-12", destination: "/models/model-cards/ministral-3-14b-25-12", permanent: true },
  { source: "/models/ministral-3-3b-25-12", destination: "/models/model-cards/ministral-3-3b-25-12", permanent: true },
  { source: "/models/ministral-3-8b-25-12", destination: "/models/model-cards/ministral-3-8b-25-12", permanent: true },
  { source: "/models/ministral-3b-24-1", destination: "/models/model-cards/ministral-3b-24-1", permanent: true },
  { source: "/models/ministral-8b-24-1", destination: "/models/model-cards/ministral-8b-24-1", permanent: true },
  { source: "/models/mistral-7b-0-1", destination: "/models/model-cards/mistral-7b-0-1", permanent: true },
  { source: "/models/mistral-7b-0-2", destination: "/models/model-cards/mistral-7b-0-2", permanent: true },
  { source: "/models/mistral-7b-0-3", destination: "/models/model-cards/mistral-7b-0-3", permanent: true },
  { source: "/models/mistral-embed-23-12", destination: "/models/model-cards/mistral-embed-23-12", permanent: true },
  { source: "/models/mistral-large-1-0-24-02", destination: "/models/model-cards/mistral-large-1-0-24-02", permanent: true },
  { source: "/models/mistral-large-2-0-24-07", destination: "/models/model-cards/mistral-large-2-0-24-07", permanent: true },
  { source: "/models/mistral-large-2-1-24-11", destination: "/models/model-cards/mistral-large-2-1-24-11", permanent: true },
  { source: "/models/mistral-large-3-25-12", destination: "/models/model-cards/mistral-large-3-25-12", permanent: true },
  { source: "/models/mistral-medium-1-0-23-12", destination: "/models/model-cards/mistral-medium-1-0-23-12", permanent: true },
  { source: "/models/mistral-medium-3-1-25-08", destination: "/models/model-cards/mistral-medium-3-1-25-08", permanent: true },
  { source: "/models/mistral-medium-3-25-05", destination: "/models/model-cards/mistral-medium-3-25-05", permanent: true },
  { source: "/models/mistral-moderation-24-11", destination: "/models/model-cards/mistral-moderation-24-11", permanent: true },
  { source: "/models/mistral-moderation-26-03", destination: "/models/model-cards/mistral-moderation-26-03", permanent: true },
  { source: "/models/mistral-nemo-12b-24-07", destination: "/models/model-cards/mistral-nemo-12b-24-07", permanent: true },
  { source: "/models/mistral-next", destination: "/models/model-cards/mistral-next", permanent: true },
  { source: "/models/mistral-saba-25-02", destination: "/models/model-cards/mistral-saba-25-02", permanent: true },
  { source: "/models/mistral-small-1-0-24-02", destination: "/models/model-cards/mistral-small-1-0-24-02", permanent: true },
  { source: "/models/mistral-small-2-0-24-09", destination: "/models/model-cards/mistral-small-2-0-24-09", permanent: true },
  { source: "/models/mistral-small-3-0-25-01", destination: "/models/model-cards/mistral-small-3-0-25-01", permanent: true },
  { source: "/models/mistral-small-3-1-25-03", destination: "/models/model-cards/mistral-small-3-1-25-03", permanent: true },
  { source: "/models/mistral-small-3-2-25-06", destination: "/models/model-cards/mistral-small-3-2-25-06", permanent: true },
  { source: "/models/mistral-small-4-0-26-03", destination: "/models/model-cards/mistral-small-4-0-26-03", permanent: true },
  { source: "/models/mistral-small-creative-25-12", destination: "/models/model-cards/mistral-small-creative-25-12", permanent: true },
  { source: "/models/mixtral-8x22b-0-1-0-3", destination: "/models/model-cards/mixtral-8x22b-0-1-0-3", permanent: true },
  { source: "/models/mixtral-8x7b-0-1", destination: "/models/model-cards/mixtral-8x7b-0-1", permanent: true },
  { source: "/models/ocr-2-25-05", destination: "/models/model-cards/ocr-2-25-05", permanent: true },
  { source: "/models/ocr-25-03", destination: "/models/model-cards/ocr-25-03", permanent: true },
  { source: "/models/ocr-3-25-12", destination: "/models/model-cards/ocr-3-25-12", permanent: true },
  { source: "/models/pixtral-12b-24-09", destination: "/models/model-cards/pixtral-12b-24-09", permanent: true },
  { source: "/models/pixtral-large-24-11", destination: "/models/model-cards/pixtral-large-24-11", permanent: true },
  { source: "/models/voxtral-mini-25-07", destination: "/models/model-cards/voxtral-mini-25-07", permanent: true },
  { source: "/models/voxtral-mini-transcribe-25-07", destination: "/models/model-cards/voxtral-mini-transcribe-25-07", permanent: true },
  { source: "/models/voxtral-mini-transcribe-26-02", destination: "/models/model-cards/voxtral-mini-transcribe-26-02", permanent: true },
  { source: "/models/voxtral-mini-transcribe-realtime-26-02", destination: "/models/model-cards/voxtral-mini-transcribe-realtime-26-02", permanent: true },
  { source: "/models/voxtral-small-25-07", destination: "/models/model-cards/voxtral-small-25-07", permanent: true },
  { source: "/models/voxtral-tts-26-03", destination: "/models/model-cards/voxtral-tts-26-03", permanent: true },
  { source: "/getting-started/quickstart", destination: "/getting-started/quickstarts", permanent: true },
  { source: "/getting-started/clients", destination: "/resources/sdks", permanent: true },
  { source: "/getting-started/changelog", destination: "/resources/changelogs", permanent: true },
  { source: "/capabilities/completion", destination: "/studio-api/conversations/chat-completion", permanent: true },
  { source: "/capabilities/completion/usage", destination: "/studio-api/conversations/chat-completion", permanent: true },
  { source: "/capabilities/completion/prompting_capabilities", destination: "/studio-api/conversations/chat-completion/prompting", permanent: true },
  { source: "/capabilities/completion/sampling", destination: "/models/best-practices/sampling", permanent: true },
  { source: "/capabilities/vision", destination: "/studio-api/conversations/vision", permanent: true },
  { source: "/capabilities/audio/speech_to_text", destination: "/studio-api/audio/speech_to_text", permanent: true },
  { source: "/capabilities/audio/speech_to_text/offline_transcription", destination: "/studio-api/audio/speech_to_text/offline_transcription", permanent: true },
  { source: "/capabilities/audio/speech_to_text/realtime_transcription", destination: "/studio-api/audio/speech_to_text/realtime_transcription", permanent: true },
  { source: "/capabilities/audio/text_to_speech", destination: "/studio-api/audio/text_to_speech", permanent: true },
  { source: "/capabilities/audio/text_to_speech/voices", destination: "/studio-api/audio/text_to_speech/voices", permanent: true },
  { source: "/capabilities/audio/text_to_speech/speech", destination: "/studio-api/audio/text_to_speech/speech", permanent: true },
  { source: "/capabilities/reasoning", destination: "/studio-api/conversations/reasoning", permanent: true },
  { source: "/capabilities/reasoning/adjustable", destination: "/studio-api/conversations/reasoning/adjustable", permanent: true },
  { source: "/capabilities/document_ai", destination: "/studio-api/document-processing/overview", permanent: true },
  { source: "/capabilities/document_ai/basic_ocr", destination: "/studio-api/document-processing/basic_ocr", permanent: true },
  { source: "/capabilities/document_ai/annotations", destination: "/studio-api/document-processing/annotations", permanent: true },
  { source: "/capabilities/document_ai/document_qna", destination: "/studio-api/document-processing/document_qna", permanent: true },
  { source: "/capabilities/code_generation", destination: "/vibe/code", permanent: true },
  { source: "/capabilities/embeddings", destination: "/studio-api/knowledge-rag/embeddings", permanent: true },
  { source: "/capabilities/function_calling", destination: "/studio-api/conversations/function-calling", permanent: true },
  { source: "/capabilities/citations", destination: "/studio-api/conversations/citations", permanent: true },
  { source: "/capabilities/structured_output", destination: "/studio-api/conversations/structured-output", permanent: true },
  { source: "/capabilities/structured_output/custom", destination: "/studio-api/conversations/structured-output/custom", permanent: true },
  { source: "/capabilities/structured_output/json_mode", destination: "/studio-api/conversations/structured-output/json_mode", permanent: true },
  { source: "/capabilities/guardrailing", destination: "/studio-api/conversations/moderation", permanent: true },
  { source: "/capabilities/batch", destination: "/studio-api/batch-processing", permanent: true },
  { source: "/capabilities/predicted_outputs", destination: "/studio-api/conversations/advanced/predicted-outputs", permanent: true },
  { source: "/capabilities/connectors", destination: "/studio-api/knowledge-rag/connectors", permanent: true },
  { source: "/capabilities/connectors/management", destination: "/studio-api/knowledge-rag/connectors/management", permanent: true },
  { source: "/capabilities/connectors/conversations", destination: "/studio-api/knowledge-rag/connectors/conversations", permanent: true },
  { source: "/capabilities/connectors/tool_calling", destination: "/studio-api/knowledge-rag/connectors/tool_calling", permanent: true },
  { source: "/capabilities/connectors/confirmation", destination: "/studio-api/knowledge-rag/connectors/confirmation", permanent: true },
  { source: "/capabilities/observability", destination: "/studio-api/observability", permanent: true },
  { source: "/capabilities/observability/quickstart", destination: "/studio-api/observability/quickstart", permanent: true },
  { source: "/capabilities/observability/explorer", destination: "/studio-api/observability/explorer", permanent: true },
  { source: "/capabilities/observability/judges", destination: "/studio-api/observability/judges", permanent: true },
  { source: "/capabilities/observability/campaigns", destination: "/studio-api/observability/campaigns", permanent: true },
  { source: "/capabilities/observability/datasets", destination: "/studio-api/observability/datasets", permanent: true },
  { source: "/agents/introduction", destination: "/studio-api/agents/introduction", permanent: true },
  { source: "/agents/agents", destination: "/studio-api/agents/agents-api", permanent: true },
  { source: "/agents/tools", destination: "/studio-api/agents/agent-tools", permanent: true },
  { source: "/agents/tools/built-in", destination: "/studio-api/agents/agent-tools", permanent: true },
  { source: "/agents/tools/built-in/websearch", destination: "/studio-api/agents/agent-tools/websearch", permanent: true },
  { source: "/agents/tools/built-in/code_interpreter", destination: "/studio-api/agents/agent-tools/code_interpreter", permanent: true },
  { source: "/agents/tools/built-in/image_generation", destination: "/studio-api/agents/agent-tools/image_generation", permanent: true },
  { source: "/agents/tools/built-in/document_library", destination: "/studio-api/knowledge-rag/libraries#connecting-libraries-to-agents", permanent: true },
  { source: "/agents/tools/mcp", destination: "/studio-api/knowledge-rag/connectors", permanent: true },
  { source: "/agents/tools/function_calling", destination: "/studio-api/agents/agent-tools/function-calling", permanent: true },
  { source: "/agents/handoffs", destination: "/studio-api/agents/handoffs", permanent: true },
  { source: "/deployment/ai-studio", destination: "/studio-api/overview", permanent: true },
  { source: "/deployment/cloud", destination: "/models/deployment/cloud-deployments", permanent: true },
  { source: "/deployment/cloud/azure", destination: "/models/deployment/cloud-deployments/azure", permanent: true },
  { source: "/deployment/cloud/amazon_bedrock", destination: "/models/deployment/cloud-deployments/amazon_bedrock", permanent: true },
  { source: "/deployment/cloud/vertex", destination: "/models/deployment/cloud-deployments/vertex", permanent: true },
  { source: "/deployment/cloud/sfcortex", destination: "/models/deployment/cloud-deployments/sfcortex", permanent: true },
  { source: "/deployment/cloud/ibm-watsonx", destination: "/models/deployment/cloud-deployments/ibm-watsonx", permanent: true },
  { source: "/deployment/cloud/outscale", destination: "/models/deployment/cloud-deployments/outscale", permanent: true },
  { source: "/deployment/self-deployment", destination: "/models/deployment/local-deployment", permanent: true },
  { source: "/deployment/self-deployment/vllm", destination: "/models/deployment/local-deployment/vllm", permanent: true },
  { source: "/deployment/self-deployment/trt", destination: "/models/deployment/local-deployment/trt", permanent: true },
  { source: "/deployment/self-deployment/skypilot", destination: "/models/deployment/local-deployment/skypilot", permanent: true },
  { source: "/deployment/self-deployment/cerebrium", destination: "/models/deployment/local-deployment/cerebrium", permanent: true },
  { source: "/deployment/self-deployment/cloudflare", destination: "/models/deployment/local-deployment/cloudflare", permanent: true },
  { source: "/deployment/self-deployment/tgi", destination: "/models/deployment/local-deployment/tgi", permanent: true },
  { source: "/workflows", destination: "/studio-api/workflows/getting-started/introduction", permanent: true },
  { source: "/workflows/getting-started/introduction", destination: "/studio-api/workflows/getting-started/introduction", permanent: true },
  { source: "/studio-api/workflows/getting-started/introduction", destination: "/studio-api/workflows/getting-started/overview", permanent: true },
  { source: "/workflows/getting-started/installation", destination: "/studio-api/workflows/getting-started/installation", permanent: true },
  { source: "/workflows/getting-started/your_first_workflow", destination: "/studio-api/workflows/getting-started/your_first_workflow", permanent: true },
  { source: "/workflows/getting-started/core_concepts/workflows", destination: "/studio-api/workflows/getting-started/core_concepts/workflows", permanent: true },
  { source: "/workflows/getting-started/core_concepts/activities", destination: "/studio-api/workflows/getting-started/core_concepts/activities", permanent: true },
  { source: "/workflows/getting-started/core_concepts/deployments", destination: "/studio-api/workflows/getting-started/core_concepts/deployments", permanent: true },
  { source: "/workflows/getting-started/core_concepts/executions", destination: "/studio-api/workflows/getting-started/core_concepts/executions", permanent: true },
  { source: "/workflows/getting-started/core_concepts/events", destination: "/studio-api/workflows/getting-started/core_concepts/events", permanent: true },
  { source: "/workflows/getting-started/core_concepts/workers", destination: "/studio-api/workflows/getting-started/core_concepts/workers", permanent: true },
  { source: "/workflows/building-workflows/workflows", destination: "/studio-api/workflows/building-workflows/workflows", permanent: true },
  { source: "/workflows/building-workflows/activities", destination: "/studio-api/workflows/building-workflows/activities", permanent: true },
  { source: "/workflows/building-workflows/activities/basics", destination: "/studio-api/workflows/building-workflows/activities/basics", permanent: true },
  { source: "/workflows/building-workflows/activities/local_activities", destination: "/studio-api/workflows/building-workflows/activities/local_activities", permanent: true },
  { source: "/workflows/building-workflows/activities/sticky_worker_sessions", destination: "/studio-api/workflows/building-workflows/activities/sticky_worker_sessions", permanent: true },
  { source: "/workflows/building-workflows/dependency_injection", destination: "/studio-api/workflows/building-workflows/dependency_injection", permanent: true },
  { source: "/workflows/building-workflows/workflow_exception", destination: "/studio-api/workflows/building-workflows/workflow_exception", permanent: true },
  { source: "/workflows/building-workflows/consuming_events", destination: "/studio-api/workflows/building-workflows/consuming_events", permanent: true },
  { source: "/workflows/building-workflows/streaming", destination: "/studio-api/workflows/building-workflows/streaming", permanent: true },
  { source: "/workflows/building-workflows/durable_agents", destination: "/studio-api/workflows/building-workflows/durable_agents", permanent: true },
  { source: "/workflows/building-workflows/scheduling", destination: "/studio-api/workflows/building-workflows/scheduling", permanent: true },
  { source: "/workflows/building-workflows/sub_workflows", destination: "/studio-api/workflows/building-workflows/sub_workflows", permanent: true },
  { source: "/workflows/building-workflows/waiting_for_conditions", destination: "/studio-api/workflows/building-workflows/waiting_for_conditions", permanent: true },
  { source: "/workflows/building-workflows/continue_as_new", destination: "/studio-api/workflows/building-workflows/continue_as_new", permanent: true },
  { source: "/workflows/interacting-with-workflows/signals", destination: "/studio-api/workflows/interacting-with-workflows/signals", permanent: true },
  { source: "/workflows/interacting-with-workflows/queries", destination: "/studio-api/workflows/interacting-with-workflows/queries", permanent: true },
  { source: "/workflows/interacting-with-workflows/updates", destination: "/studio-api/workflows/interacting-with-workflows/updates", permanent: true },
  { source: "/workflows/interacting-with-workflows/conversational_workflows", destination: "/studio-api/workflows/interacting-with-workflows/conversational_workflows", permanent: true },
  { source: "/workflows/managing-workflows-in-production/concurrency", destination: "/studio-api/workflows/managing-workflows-in-production/concurrency", permanent: true },
  { source: "/workflows/managing-workflows-in-production/rate_limiting", destination: "/studio-api/workflows/managing-workflows-in-production/rate_limiting", permanent: true },
  { source: "/workflows/managing-workflows-in-production/error_codes", destination: "/studio-api/workflows/managing-workflows-in-production/error_codes", permanent: true },
  { source: "/workflows/managing-workflows-in-production/deployments", destination: "/studio-api/workflows/managing-workflows-in-production/deployments", permanent: true },
  { source: "/workflows/managing-workflows-in-production/reset_workflow", destination: "/studio-api/workflows/managing-workflows-in-production/reset_workflow", permanent: true },
  { source: "/workflows/managing-workflows-in-production/execution_context", destination: "/studio-api/workflows/managing-workflows-in-production/execution_context", permanent: true },
  { source: "/workflows/observability", destination: "/studio-api/workflows/observability", permanent: true },
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
  // Category root URLs without a page.mdx (mirror _category_.json links)
  {
    source: "/vibe",
    destination: "/vibe/overview",
    permanent: true,
  },
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
    destination: "/vibe/work/connectors/knowledge-connectors",
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
    destination: "/studio-api/knowledge-rag/rag_quickstart",
    permanent: true,
  },
  {
    source: "/guides/sampling",
    destination: "/models/best-practices/sampling",
    permanent: true,
  },
  {
    source: "/guides/contribute/ambassador",
    destination: "/community/ambassadors",
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
    destination: "/studio-api/knowledge-rag/rag_quickstart",
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
    destination: "/studio-api/document-processing/overview",
    permanent: true,
  },
  {
    source: "/capabilities/document_ai/:path*",
    destination: "/studio-api/document-processing/:path*",
    permanent: true,
  },
  {
    source: "/capabilities/fim",
    destination: "/vibe/code",
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
    source: "/capabilities/audio",
    destination: "/studio-api/audio/speech_to_text",
    permanent: true,
  },
  {
    source: "/capabilities/audio_transcription",
    destination: "/studio-api/audio/speech_to_text",
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
    destination: "/vibe/code/overview",
    permanent: true,
  },
  // Built-in tools flatten
  {
    source: "/studio-api/agents/agents-tooling/built-in/:path*",
    destination: "/studio-api/agents/agent-tools/:path*",
    permanent: true,
  },
  {
    source: "/studio-api/agents/agents-tooling/built-in",
    destination: "/studio-api/agents/agent-tools",
    permanent: true,
  },
  // Tools redirects
  {
    source: "/tools/bult-in/websearch",
    destination: "/studio-api/agents/agent-tools/websearch",
    permanent: true,
  },
  {
    source: "/agents/mcp",
    destination: "/studio-api/knowledge-rag/connectors",
    permanent: true,
  },
  {
    source: "/agents/tools/mcp",
    destination: "/studio-api/knowledge-rag/connectors",
    permanent: true,
  },
  {
    source: "/studio-api/agents/agents-tooling/mcp",
    destination: "/studio-api/knowledge-rag/connectors",
    permanent: true,
  },
  {
    source: "/agents/tools/built-in/:path*",
    destination: "/studio-api/agents/agent-tools/:path*",
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
    destination: "/studio-api/agents/agent-tools/image_generation",
    permanent: true,
  },
  {
    source: "/agents/connectors/websearch",
    destination: "/studio-api/agents/agent-tools/websearch",
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
    destination: "/studio-api/document-processing/basic_ocr",
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
    source: "/studio-api/workflows/interacting-with-workflows/conversational_workflows/publish_in_le_chat",
    destination: "/studio-api/workflows/interacting-with-workflows/conversational_workflows/publish_in_vibe",
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
    destination: "/models/model-selection-guide",
    permanent: true,
  },
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
