import type { Lingo } from '@lingo.dev/react';

export type PlatformInterfaceType = 'Vibe' | 'Studio' | 'Admin';

export type PlatformFeature = {
    id: string;
    name: string;
    shortDescription: string;
    description: string;
    tags: string[];
    icon: string;
    interfaceType: PlatformInterfaceType;
};

export function getPlatformFeaturesData(l: Lingo): PlatformFeature[] {
    return [
        // VIBE (Work + Chat)
        {
            id: 'le-chat-chat',
            name: l.text('Chat', { context: 'Name of a Mistral platform feature' }),
            shortDescription: l.text('Conversational AI interface', { context: 'Short description of the Chat feature' }),
            description: l.text("The core conversational interface powered by Mistral's latest models. Features multi-turn context retention, multilingual support, and a responsive multi-modal experience for everyday productivity tasks.", { context: 'Detailed description of the Chat feature' }),
            tags: [
                l.text('Multi-modal', { context: 'Keyword tag for the Chat feature' }),
                l.text('Multilingual', { context: 'Keyword tag for the Chat feature' }),
            ],
            icon: 'message-square',
            interfaceType: 'Vibe',
        },
        {
            id: 'le-chat-deep-research',
            name: l.text('Deep Research', { context: 'Name of a Mistral platform feature' }),
            shortDescription: l.text('Autonomous web research & reporting', { context: 'Short description of the Deep Research feature' }),
            description: l.text('Vibe autonomously plans a research strategy, navigates the web to synthesize multiple trusted sources, and generates long-form analytical reports.', { context: 'Detailed description of the Deep Research feature' }),
            tags: [
                l.text('Browsing', { context: 'Keyword tag for the Deep Research feature' }),
                l.text('Synthesis', { context: 'Keyword tag for the Deep Research feature' }),
                l.text('Reports', { context: 'Keyword tag for the Deep Research feature' }),
            ],
            icon: 'search',
            interfaceType: 'Vibe',
        },
        {
            id: 'le-chat-document-intel',
            name: l.text('Document Intelligence', { context: 'Name of a Mistral platform feature' }),
            shortDescription: l.text('Upload & analyze files with OCR', { context: 'Short description of the Document Intelligence feature' }),
            description: l.text('Upload PDFs, spreadsheets, and Word documents directly into chat. Vibe applies OCR 3 natively to extract text from scanned images and complex document layouts.', { context: 'Detailed description of the Document Intelligence feature' }),
            tags: [
                l.text('PDFs', { context: 'Keyword tag for the Document Intelligence feature' }),
                l.text('OCR 3', { context: 'Keyword tag for the Document Intelligence feature' }),
                l.text('Analysis', { context: 'Keyword tag for the Document Intelligence feature' }),
            ],
            icon: 'file-text',
            interfaceType: 'Vibe',
        },
        {
            id: 'le-chat-code-interpreter',
            name: l.text('Code Interpreter', { context: 'Name of a Mistral platform feature' }),
            shortDescription: l.text('Run Python natively in chat', { context: 'Short description of the Code Interpreter feature' }),
            description: l.text('A secure Python sandbox available inside Vibe (Chat mode for Python, with a TypeScript code environment in Work mode). Upload datasets to explore data, generate charts, and automate data transformations without leaving your browser.', { context: 'Detailed description of the Code Interpreter feature' }),
            tags: [
                l.text('Python', { context: 'Keyword tag for the Code Interpreter feature' }),
                l.text('Data', { context: 'Keyword tag for the Code Interpreter feature' }),
                l.text('Charts', { context: 'Keyword tag for the Code Interpreter feature' }),
            ],
            icon: 'code',
            interfaceType: 'Vibe',
        },
        {
            id: 'le-chat-canvas',
            name: l.text('Canvas', { context: 'Name of a Mistral platform feature' }),
            shortDescription: l.text('Real-time collaborative editing', { context: 'Short description of the Canvas feature' }),
            description: l.text("An integrated writing and coding surface. Vibe generates text, code, or presentations and lets you collaboratively refine and edit the AI's output in real time.", { context: 'Detailed description of the Canvas feature' }),
            tags: [
                l.text('Documents', { context: 'Keyword tag for the Canvas feature' }),
                l.text('Code', { context: 'Keyword tag for the Canvas feature' }),
                l.text('Inline Edits', { context: 'Keyword tag for the Canvas feature' }),
            ],
            icon: 'pen-tool',
            interfaceType: 'Vibe',
        },
        {
            id: 'le-chat-memories',
            name: l.text('Memories & Libraries', { context: 'Name of a Mistral platform feature' }),
            shortDescription: l.text('Cross-conversation context storage', { context: 'Short description of the Memories & Libraries feature' }),
            description: l.text("Enable Memories to let Vibe retain your preferences across sessions. Build Libraries from uploaded documents to ground the model's responses in your own secure knowledge base.", { context: 'Detailed description of the Memories & Libraries feature' }),
            tags: [
                l.text('Context', { context: 'Keyword tag for the Memories & Libraries feature' }),
                l.text('RAG', { context: 'Keyword tag for the Memories & Libraries feature' }),
                l.text('Knowledge', { context: 'Keyword tag for the Memories & Libraries feature' }),
            ],
            icon: 'briefcase',
            interfaceType: 'Vibe',
        },
        {
            id: 'le-chat-agents',
            name: l.text('Custom Agents', { context: 'Name of a Mistral platform feature' }),
            shortDescription: l.text('Customizable AI assistants', { context: 'Short description of the Custom Agents feature' }),
            description: l.text('Create AI assistants for specific workflows. Define custom system instructions, attach tools (like MCP connectors), link knowledge bases, and share them securely with your team.', { context: 'Detailed description of the Custom Agents feature' }),
            tags: [
                l.text('Assistants', { context: 'Keyword tag for the Custom Agents feature' }),
                l.text('Tools', { context: 'Keyword tag for the Custom Agents feature' }),
                l.text('Teams', { context: 'Keyword tag for the Custom Agents feature' }),
            ],
            icon: 'bot',
            interfaceType: 'Vibe',
        },

        // VIBE CODE
        {
            id: 'vibe-terminal',
            name: l.text('Terminal Agent', { context: 'Name of a Mistral platform feature' }),
            shortDescription: l.text('Conversational coding in your terminal', { context: 'Short description of the Terminal Agent feature' }),
            description: l.text('A conversational interface to your codebase, right in the terminal. Reference files with @, run shell commands with !, and use slash-command skills to automate common workflows.', { context: 'Detailed description of the Terminal Agent feature' }),
            tags: [
                l.text('CLI', { context: 'Keyword tag for the Terminal Agent feature' }),
                l.text('Devstral', { context: 'Keyword tag for the Terminal Agent feature' }),
                l.text('Terminal', { context: 'Keyword tag for the Terminal Agent feature' }),
            ],
            icon: 'code',
            interfaceType: 'Vibe',
        },
        {
            id: 'vibe-agents-skills',
            name: l.text('Agents & Skills', { context: 'Name of a Mistral platform feature' }),
            shortDescription: l.text('Custom agents with reusable skills', { context: 'Short description of the Agents & Skills feature' }),
            description: l.text('Build custom agents with system prompts and reusable slash-command skills. Automate repetitive workflows like code review, test generation, and documentation updates.', { context: 'Detailed description of the Agents & Skills feature' }),
            tags: [
                l.text('Agents', { context: 'Keyword tag for the Agents & Skills feature' }),
                l.text('Automation', { context: 'Keyword tag for the Agents & Skills feature' }),
                l.text('Skills', { context: 'Keyword tag for the Agents & Skills feature' }),
            ],
            icon: 'bot',
            interfaceType: 'Vibe',
        },
        {
            id: 'vibe-ide-integration',
            name: l.text('IDE Integration', { context: 'Name of a Mistral platform feature' }),
            shortDescription: l.text('JetBrains and Zed support', { context: 'Short description of the IDE Integration feature' }),
            description: l.text('Integrate Vibe Code with JetBrains and Zed via the Agent Communication Protocol. Get AI assistance directly in your editor while keeping terminal access.', { context: 'Detailed description of the IDE Integration feature' }),
            tags: [
                l.text('JetBrains', { context: 'Keyword tag for the IDE Integration feature' }),
                l.text('Zed', { context: 'Keyword tag for the IDE Integration feature' }),
            ],
            icon: 'code',
            interfaceType: 'Vibe',
        },
        {
            id: 'vibe-local',
            name: l.text('Local Mode', { context: 'Name of a Mistral platform feature' }),
            shortDescription: l.text('Fully offline with local models', { context: 'Short description of the Local Mode feature' }),
            description: l.text('Run Mistral Vibe offline with locally deployed models. Keep your code on your machine with no data leaving your environment, while retaining full agent capabilities.', { context: 'Detailed description of the Local Mode feature' }),
            tags: [
                l.text('Offline', { context: 'Keyword tag for the Local Mode feature' }),
                l.text('Privacy', { context: 'Keyword tag for the Local Mode feature' }),
                l.text('Local', { context: 'Keyword tag for the Local Mode feature' }),
            ],
            icon: 'lock',
            interfaceType: 'Vibe',
        },

        // STUDIO
        {
            id: 'studio-playground',
            name: l.text('Playground', { context: 'Name of a Mistral platform feature' }),
            shortDescription: l.text('Interactive prompt & parameter testing', { context: 'Short description of the Playground feature' }),
            description: l.text('A visual lab to experiment with system prompts, user messages, and generation parameters (like Temperature and Top-P). Test prompts side-by-side across different Mistral models instantly.', { context: 'Detailed description of the Playground feature' }),
            tags: [
                l.text('Parameters', { context: 'Keyword tag for the Playground feature' }),
                l.text('Side-by-side', { context: 'Keyword tag for the Playground feature' }),
            ],
            icon: 'mouse-pointer',
            interfaceType: 'Studio',
        },
        {
            id: 'studio-api-keys',
            name: l.text('API Keys', { context: 'Name of a Mistral platform feature' }),
            shortDescription: l.text('Workspace-scoped access tokens', { context: 'Short description of the API Keys feature' }),
            description: l.text('Generate and securely manage programmatic access tokens. API keys are scope-limited to specific workspaces, allowing precise control over which applications can access specific resources.', { context: 'Detailed description of the API Keys feature' }),
            tags: [
                l.text('Auth', { context: 'Keyword tag for the API Keys feature' }),
                l.text('Tokens', { context: 'Keyword tag for the API Keys feature' }),
                l.text('Rotation', { context: 'Keyword tag for the API Keys feature' }),
            ],
            icon: 'key',
            interfaceType: 'Studio',
        },
        {
            id: 'studio-evaluation',
            name: l.text('Evaluation', { context: 'Name of a Mistral platform feature' }),
            shortDescription: l.text('Systematic benchmark testing', { context: 'Short description of the Evaluation feature' }),
            description: l.text('Run benchmark pipelines against deployments or complex system prompts to objectively measure accuracy, performance, and detect regressions over time.', { context: 'Detailed description of the Evaluation feature' }),
            tags: [
                l.text('Datasets', { context: 'Keyword tag for the Evaluation feature' }),
                l.text('Performance', { context: 'Keyword tag for the Evaluation feature' }),
            ],
            icon: 'activity',
            interfaceType: 'Studio',
        },
        {
            id: 'studio-agents-api',
            name: l.text('Agents API', { context: 'Name of a Mistral platform feature' }),
            shortDescription: l.text('Programmatic agent execution', { context: 'Short description of the Agents API feature' }),
            description: l.text('Deploy custom agents into production. The Agents API allows developers to programmatically execute workflows where Mistral models autonomously orchestrate external tool calling.', { context: 'Detailed description of the Agents API feature' }),
            tags: [
                l.text('Production', { context: 'Keyword tag for the Agents API feature' }),
                l.text('Tools', { context: 'Keyword tag for the Agents API feature' }),
                l.text('API', { context: 'Keyword tag for the Agents API feature' }),
            ],
            icon: 'bot',
            interfaceType: 'Studio',
        },

        // ADMIN
        {
            id: 'admin-users',
            name: l.text('User Management', { context: 'Name of a Mistral platform feature' }),
            shortDescription: l.text('Manage members, roles & seats', { context: 'Short description of the User Management feature' }),
            description: l.text('Centrally administer your organization. Invite team members, enforce secure Admin/Billing/Member roles, and allocate paid seats for premium products like Vibe Team and Mistral Code.', { context: 'Detailed description of the User Management feature' }),
            tags: [
                l.text('Roles', { context: 'Keyword tag for the User Management feature' }),
                l.text('Seats', { context: 'Keyword tag for the User Management feature' }),
                l.text('Access', { context: 'Keyword tag for the User Management feature' }),
            ],
            icon: 'users',
            interfaceType: 'Admin',
        },
        {
            id: 'admin-sso',
            name: l.text('Single Sign-On (SSO)', { context: 'Name of a Mistral platform feature' }),
            shortDescription: l.text('SAML-based authentication', { context: 'Short description of the Single Sign-On (SSO) feature' }),
            description: l.text('Mandate corporate security policies by connecting Mistral Platform to your existing identity provider via SAML SSO. Includes secure domain name verification to claim organizational domains.', { context: 'Detailed description of the Single Sign-On (SSO) feature' }),
            tags: [
                l.text('SAML', { context: 'Keyword tag for the Single Sign-On (SSO) feature' }),
                l.text('Identity', { context: 'Keyword tag for the Single Sign-On (SSO) feature' }),
                l.text('Domains', { context: 'Keyword tag for the Single Sign-On (SSO) feature' }),
            ],
            icon: 'shield',
            interfaceType: 'Admin',
        },
        {
            id: 'admin-workspaces',
            name: l.text('Workspaces', { context: 'Name of a Mistral platform feature' }),
            shortDescription: l.text('Isolated team environments', { context: 'Short description of the Workspaces feature' }),
            description: l.text('Divide your organization into distinct, secure workspaces. Isolate API keys, projects, and billing groups so that different departments operations never overlap.', { context: 'Detailed description of the Workspaces feature' }),
            tags: [
                l.text('Isolation', { context: 'Keyword tag for the Workspaces feature' }),
                l.text('Projects', { context: 'Keyword tag for the Workspaces feature' }),
                l.text('Namespaces', { context: 'Keyword tag for the Workspaces feature' }),
            ],
            icon: 'briefcase',
            interfaceType: 'Admin',
        },
        {
            id: 'admin-billing',
            name: l.text('Billing & Limits', { context: 'Name of a Mistral platform feature' }),
            shortDescription: l.text('Invoices & spending controls', { context: 'Short description of the Billing & Limits feature' }),
            description: l.text('Monitor token expenditure in real time. Download invoices, update payment methods, and establish strict hard spending caps per workspace to completely prevent unexpected cost overruns.', { context: 'Detailed description of the Billing & Limits feature' }),
            tags: [
                l.text('Payments', { context: 'Keyword tag for the Billing & Limits feature' }),
                l.text('Budgets', { context: 'Keyword tag for the Billing & Limits feature' }),
                l.text('Caps', { context: 'Keyword tag for the Billing & Limits feature' }),
            ],
            icon: 'credit-card',
            interfaceType: 'Admin',
        },
        {
            id: 'admin-audit',
            name: l.text('Audit Logs', { context: 'Name of a Mistral platform feature' }),
            shortDescription: l.text('Compliance & usage tracking', { context: 'Short description of the Audit Logs feature' }),
            description: l.text('Maintain a strict, chronological record of organizational events. Track when users are invited, when API keys are generated, and view security events for internal compliance auditing.', { context: 'Detailed description of the Audit Logs feature' }),
            tags: [
                l.text('Compliance', { context: 'Keyword tag for the Audit Logs feature' }),
                l.text('Export', { context: 'Keyword tag for the Audit Logs feature' }),
                l.text('Tracking', { context: 'Keyword tag for the Audit Logs feature' }),
            ],
            icon: 'file-text',
            interfaceType: 'Admin',
        },
        {
            id: 'admin-privacy',
            name: l.text('Data Privacy Controls', { context: 'Name of a Mistral platform feature' }),
            shortDescription: l.text('GDPR & training opt-outs', { context: 'Short description of the Data Privacy Controls feature' }),
            description: l.text('Take full control of data sovereignty. Admins can globally opt out of data collection for model training, manage data retention policies, and execute strict GDPR deletion requests.', { context: 'Detailed description of the Data Privacy Controls feature' }),
            tags: [
                l.text('GDPR', { context: 'Keyword tag for the Data Privacy Controls feature' }),
                l.text('Opt-out', { context: 'Keyword tag for the Data Privacy Controls feature' }),
                l.text('Policy', { context: 'Keyword tag for the Data Privacy Controls feature' }),
            ],
            icon: 'shield',
            interfaceType: 'Admin',
        },
    ];
}
