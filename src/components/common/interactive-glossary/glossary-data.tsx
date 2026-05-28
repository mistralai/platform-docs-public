import * as React from 'react';
import type { Lingo } from '@lingo.dev/react';

const GLOSSARY_CATEGORY_KEYS = [
    'vibe',
    'api',
    'concepts',
    'models',
    'billing',
    'platform',
] as const;

export type GlossaryCategoryKey = (typeof GLOSSARY_CATEGORY_KEYS)[number];

export type GlossaryTerm = {
    term: string;
    definition: React.ReactNode;
    categories: string[];
};

function glossaryCategoryLabel(category: GlossaryCategoryKey, l: Lingo): string {
    switch (category) {
        case 'vibe':
            return l.text('Vibe', { context: 'Glossary category label' });
        case 'api':
            return l.text('API', { context: 'Glossary category label' });
        case 'concepts':
            return l.text('Concepts', { context: 'Glossary category label' });
        case 'models':
            return l.text('Models', { context: 'Glossary category label' });
        case 'billing':
            return l.text('Billing', { context: 'Glossary category label' });
        case 'platform':
            return l.text('Platform', { context: 'Glossary category label' });
    }
}

function categories(keys: GlossaryCategoryKey[], l: Lingo): string[] {
    return keys.map(key => glossaryCategoryLabel(key, l));
}

export function getGlossaryData(l: Lingo): GlossaryTerm[] {
    return [
        {
            term: l.text('Agent', { context: 'Glossary term for an AI agent' }),
            definition: l.text("An AI assistant configured with specific instructions, tools, and an optional knowledge base. Agents behave consistently across conversations and can be shared across a team. In Vibe, the equivalent feature in Work is called a Skill. Agents are still available in Chat (Vibe's legacy mode), and can be built programmatically via the Agents API in Studio.", { context: 'Definition of the Agent glossary term' }),
            categories: categories(['vibe', 'api'], l),
        },
        {
            term: l.text('Context window', { context: 'Glossary term for an AI model context limit' }),
            definition: (
                <>
                    {l.text('The maximum number of tokens a model can process in a single request, including input (prompt and files) plus output combined. Earlier content is dropped when the limit is exceeded.', { context: 'Definition of the Context window glossary term' })}{' '}
                    <em className="text-foreground/50 not-italic text-xs">{l.text('→ Token', { context: 'Cross-reference label from Context window to Token' })}</em>
                </>
            ),
            categories: categories(['concepts'], l),
        },
        {
            term: l.text('Embeddings', { context: 'Glossary term for vector embeddings' }),
            definition: (
                <>
                    {l.text('Numerical vector representations of text that encode semantic meaning. Similar text produces similar vectors, enabling similarity search, clustering, and classification. Mistral Embed produces 1024-dimensional vectors.', { context: 'Definition of the Embeddings glossary term' })}{' '}
                    <em className="text-foreground/50 not-italic text-xs">{l.text('Used in: RAG, search, recommendations.', { context: 'Short note about how Embeddings is used' })}</em>
                </>
            ),
            categories: categories(['models', 'concepts'], l),
        },
        {
            term: l.text('Free mode', { context: 'Glossary term for the default free Studio API access tier' }),
            definition: (
                <>
                    {l.text('Default Studio API access. No credit card required. Conservative rate limits suitable for evaluation and prototyping.', { context: 'Definition of the Free mode glossary term' })}{' '}
                    <em className="text-foreground/50 not-italic text-xs">{l.text('→ Scale plan', { context: 'Cross-reference label from Free mode to Scale plan' })}</em>
                </>
            ),
            categories: categories(['billing'], l),
        },
        {
            term: l.text('FIM', { context: 'Glossary term for fill-in-the-middle code completion' }),
            definition: (
                <>
                    <span className="text-foreground/60 text-xs">{l.text('(fill-in-the-middle)', { context: 'Expansion of the FIM acronym' })}</span>{' '}
                    {l.text('A code generation mode where the model generates text based on both preceding (prefix) and following (suffix) context. Used for mid-function completion in IDEs. Available in Codestral.', { context: 'Definition of the FIM glossary term' })}
                </>
            ),
            categories: categories(['models', 'concepts'], l),
        },
        {
            term: l.text('Function calling', { context: 'Glossary term for model-initiated tool or API calls' }),
            definition: (
                <>
                    <span className="text-foreground/60 text-xs">{l.text('(tool use)', { context: 'Alternate term for Function calling' })}</span>{' '}
                    {l.text('A capability that lets the model request execution of external functions or APIs mid-conversation. Your application executes the function and returns the result, allowing the model to incorporate real-world data into its response.', { context: 'Definition of the Function calling glossary term' })}
                </>
            ),
            categories: categories(['api', 'concepts'], l),
        },
        {
            term: l.text('Guardrailing', { context: 'Glossary term for output safety and policy controls' }),
            definition: l.text('Policies applied at the system level to restrict or shape model output, enforcing content policies, defining permitted output formats, and setting behavioral constraints without modifying the underlying model.', { context: 'Definition of the Guardrailing glossary term' }),
            categories: categories(['concepts'], l),
        },
        {
            term: l.text('Inference', { context: 'Glossary term for running a trained AI model' }),
            definition: l.text('Running a trained model to generate a response. Calling the API is running inference, as distinct from training, which modifies model weights.', { context: 'Definition of the Inference glossary term' }),
            categories: categories(['concepts'], l),
        },
        {
            term: l.text('Studio', { context: 'Glossary term for Mistral\'s developer platform' }),
            definition: l.text("Mistral AI's SaaS API and developer platform at console.mistral.ai. Provides API access, the Studio developer console, and model management tools.", { context: 'Definition of the Studio glossary term' }),
            categories: categories(['platform'], l),
        },
        {
            term: l.text('OCR', { context: 'Glossary term for optical character recognition' }),
            definition: (
                <>
                    <span className="text-foreground/60 text-xs">{l.text('(optical character recognition)', { context: 'Expansion of the OCR acronym' })}</span>{' '}
                    {l.text('Extracting structured text and images from document files. Mistral OCR processes PDFs and scanned documents, preserving reading order and layout structure.', { context: 'Definition of the OCR glossary term' })}
                </>
            ),
            categories: categories(['api', 'concepts'], l),
        },
        {
            term: l.text('RAG', { context: 'Glossary term for retrieval-augmented generation' }),
            definition: (
                <>
                    <span className="text-foreground/60 text-xs">{l.text('(retrieval-augmented generation)', { context: 'Expansion of the RAG acronym' })}</span>{' '}
                    {l.text('A technique that improves factual accuracy by retrieving relevant documents from an external knowledge base and including them in the prompt context. Reduces hallucinations and enables models to answer from proprietary or up-to-date data.', { context: 'Definition of the RAG glossary term' })}{' '}
                    <em className="text-foreground/50 not-italic text-xs">{l.text('Used with: Embeddings, Agents.', { context: 'Short note about how RAG is used' })}</em>
                </>
            ),
            categories: categories(['concepts'], l),
        },
        {
            term: l.text('Scale plan', { context: 'Glossary term for the pay-as-you-go API tier' }),
            definition: (
                <>
                    {l.text('Pay-as-you-go API tier. Billed by token consumption. Rate-limit tiers upgrade automatically based on cumulative billing. Suitable for production workloads above Free mode limits.', { context: 'Definition of the Scale plan glossary term' })}{' '}
                    <em className="text-foreground/50 not-italic text-xs">{l.text('→ Free mode', { context: 'Cross-reference label from Scale plan to Free mode' })}</em>
                </>
            ),
            categories: categories(['billing'], l),
        },
        {
            term: l.text('Streaming', { context: 'Glossary term for streaming model output' }),
            definition: l.text('A response delivery mode where tokens are sent as they are generated rather than as a single complete response. Reduces perceived latency in interactive applications such as chat interfaces.', { context: 'Definition of the Streaming glossary term' }),
            categories: categories(['api', 'concepts'], l),
        },
        {
            term: l.text('System prompt', { context: 'Glossary term for the instruction that sets model behavior' }),
            definition: l.text('An instruction at the start of a conversation that shapes model behavior throughout the session. Defines persona, output format, constraints, and context. Not shown to end users, but consumes tokens toward the context window limit.', { context: 'Definition of the System prompt glossary term' }),
            categories: categories(['concepts'], l),
        },
        {
            term: l.text('Temperature', { context: 'Glossary term for a model sampling parameter' }),
            definition: l.text('A parameter (0.0 - 1.0) that controls output randomness. Lower values (0.2) produce focused, deterministic output. Higher values (0.8) produce more varied and creative output. Set to 0 for tasks where consistency and reproducibility are critical.', { context: 'Definition of the Temperature glossary term' }),
            categories: categories(['api', 'concepts'], l),
        },
        {
            term: l.text('Token', { context: 'Glossary term for the text units used by language models' }),
            definition: l.text('The basic unit of text models process: subword fragments, not full words. Roughly 1 token ≈ 0.75 English words ≈ 4 characters. Token count determines API pricing and context window consumption.', { context: 'Definition of the Token glossary term' }),
            categories: categories(['billing', 'concepts'], l),
        },
        {
            term: l.text('Vibe', { context: "Glossary term for Mistral's unified agent" }),
            definition: l.text("Mistral's unified agent. Runs in three modes: Work (productivity in the web and mobile chat UI at chat.mistral.ai), Code (CLI, VS Code extension, or remote web sessions at code.mistral.ai), and Chat (turn-based mode that preserves legacy Le Chat features such as Agents, Think mode, Deep Research, Code Interpreter, and Memories).", { context: 'Definition of the Vibe glossary term' }),
            categories: categories(['vibe'], l),
        },
        {
            term: l.text('Workspace', { context: 'Glossary term for an isolated Mistral organization environment' }),
            definition: l.text('An isolated environment within a Mistral organization. Each workspace has its own API keys, usage metrics, and billing bucket. Use workspaces to separate development and production, or to isolate usage and spending by team or project.', { context: 'Definition of the Workspace glossary term' }),
            categories: categories(['platform', 'billing'], l),
        },
    ];
}
