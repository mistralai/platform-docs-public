import * as React from 'react';

export type GlossaryTerm = {
    term: string;
    definition: React.ReactNode;
    categories: string[];
};

export const glossaryData: GlossaryTerm[] = [
    {
        term: 'Agent',
        definition:
            'An AI assistant configured with specific instructions, tools, and an optional knowledge base. Agents behave consistently across conversations and can be shared across a team. Build agents without code in Le Chat, or manage them via the Agents API.',
        categories: ['Le Chat', 'API'],
    },
    {
        term: 'Context window',
        definition: (
            <>
                The maximum number of tokens a model can process in a single request, including input (prompt and files) plus output combined. Earlier content is dropped when the limit is exceeded. <em className="text-foreground/50 not-italic text-xs">→ Token</em>
            </>
        ),
        categories: ['Concepts'],
    },
    {
        term: 'Embeddings',
        definition: (
            <>
                Numerical vector representations of text that encode semantic meaning. Similar text produces similar vectors, enabling similarity search, clustering, and classification. Mistral Embed produces 1024-dimensional vectors. <em className="text-foreground/50 not-italic text-xs">Used in: RAG, search, recommendations.</em>
            </>
        ),
        categories: ['Models', 'Concepts'],
    },
    {
        term: 'Experiment plan',
        definition: (
            <>
                Pay-as-you-go API tier. Billed by token with no monthly commitment. Suitable for development, evaluation, and low-volume production. <em className="text-foreground/50 not-italic text-xs">→ Scale plan</em>
            </>
        ),
        categories: ['Billing'],
    },
    {
        term: 'FIM',
        definition: (
            <>
                <span className="text-foreground/60 text-xs">(fill-in-the-middle)</span> A code generation mode where the model generates text based on both preceding (prefix) and following (suffix) context. Used for mid-function completion in IDEs. Available in Codestral.
            </>
        ),
        categories: ['Models', 'Concepts'],
    },
    {
        term: 'Fine-tuning',
        definition: (
            <>
                Further training a pre-trained model on a domain-specific dataset to improve performance on a target task, adopt a specific tone, or produce a particular output format. Mistral supports LoRA-based fine-tuning on Studio. <em className="text-foreground/50 not-italic text-xs">→ LoRA</em>
            </>
        ),
        categories: ['Platform', 'Concepts'],
    },
    {
        term: 'Function calling',
        definition: (
            <>
                <span className="text-foreground/60 text-xs">(tool use)</span> A capability that lets the model request execution of external functions or APIs mid-conversation. Your application executes the function and returns the result, allowing the model to incorporate real-world data into its response.
            </>
        ),
        categories: ['API', 'Concepts'],
    },
    {
        term: 'Guardrailing',
        definition:
            'Policies applied at the system level to restrict or shape model output, enforcing content policies, defining permitted output formats, and setting behavioral constraints without modifying the underlying model.',
        categories: ['Concepts'],
    },
    {
        term: 'Inference',
        definition:
            'Running a trained model to generate a response. Calling the API is running inference, as distinct from training or fine-tuning, which modify model weights.',
        categories: ['Concepts'],
    },
    {
        term: 'Studio',
        definition:
            "Mistral AI's SaaS API and developer platform at console.mistral.ai. Provides API access, the Studio developer console, fine-tuning, and model management tools.",
        categories: ['Platform'],
    },
    {
        term: 'LoRA',
        definition: (
            <>
                <span className="text-foreground/60 text-xs">(low-rank adaptation)</span> A parameter-efficient fine-tuning technique that adds small trainable matrices to a frozen base model instead of updating all weights. Substantially reduces compute and memory requirements while achieving results close to full fine-tuning.
            </>
        ),
        categories: ['Concepts'],
    },
    {
        term: 'OCR',
        definition: (
            <>
                <span className="text-foreground/60 text-xs">(optical character recognition)</span> Extracting structured text and images from document files. Mistral OCR processes PDFs and scanned documents, preserving reading order and layout structure.
            </>
        ),
        categories: ['API', 'Concepts'],
    },
    {
        term: 'RAG',
        definition: (
            <>
                <span className="text-foreground/60 text-xs">(retrieval-augmented generation)</span> A technique that improves factual accuracy by retrieving relevant documents from an external knowledge base and including them in the prompt context. Reduces hallucinations and enables models to answer from proprietary or up-to-date data. <em className="text-foreground/50 not-italic text-xs">Used with: Embeddings, Agents.</em>
            </>
        ),
        categories: ['Concepts'],
    },
    {
        term: 'Scale plan',
        definition: (
            <>
                Committed-throughput API tier for high-volume production workloads. Provides reserved capacity, guaranteed throughput, and lower latency variance than the Experiment plan. Pricing is negotiated based on committed volume. <em className="text-foreground/50 not-italic text-xs">→ Experiment plan</em>
            </>
        ),
        categories: ['Billing'],
    },
    {
        term: 'Streaming',
        definition:
            'A response delivery mode where tokens are sent as they are generated rather than as a single complete response. Reduces perceived latency in interactive applications such as chat interfaces.',
        categories: ['API', 'Concepts'],
    },
    {
        term: 'System prompt',
        definition:
            'An instruction at the start of a conversation that shapes model behavior throughout the session. Defines persona, output format, constraints, and context. Not shown to end users, but consumes tokens toward the context window limit.',
        categories: ['Concepts'],
    },
    {
        term: 'Temperature',
        definition:
            'A parameter (0.0 – 1.0) that controls output randomness. Lower values (0.2) produce focused, deterministic output. Higher values (0.8) produce more varied and creative output. Set to 0 for tasks where consistency and reproducibility are critical.',
        categories: ['API', 'Concepts'],
    },
    {
        term: 'Token',
        definition:
            'The basic unit of text models process: subword fragments, not full words. Roughly 1 token ≈ 0.75 English words ≈ 4 characters. Token count determines API pricing and context window consumption.',
        categories: ['Billing', 'Concepts'],
    },
    {
        term: 'Le Chat',
        definition:
            "Mistral's collaborative AI workspace at chat.mistral.ai. Provides Chat, Canvas, Agents, and Deep Research without requiring code.",
        categories: ['Le Chat'],
    },
    {
        term: 'Workspace',
        definition:
            'An isolated environment within a Mistral organization. Each workspace has its own API keys, usage metrics, and billing bucket. Use workspaces to separate development and production, or to isolate usage and spending by team or project.',
        categories: ['Platform', 'Billing'],
    },
];
