# Unified UX + Writing + Engineering Doctrine

This document serves as the absolute standard for all documentation writing, engineering, and UX design.

## 1. Core Philosophy (Merged from Microsoft + Google)
- **1.1 Clarity is Respect**: If a user is confused, we failed. Use plain language, active voice, short sentences, and common words over jargon. Explain concepts before procedures.
- **1.2 Task-First, Not Feature-First**: Documentation must answer what the user is trying to accomplish and what problem they are solving. Prioritize getting started, common tasks, troubleshooting, and edge cases. Never lead with internal architecture.
- **1.3 Be Conversational but Professional**: Direct, friendly, not robotic, not overly casual. **Banned words**: "Simply", "Just", "Obviously", "Easily", "Powerful", "Seamless". No hype or marketing fluff.

## 2. Writing Standards
- **2.1 Sentence Structure**: Active voice, imperative for instructions (e.g., "Add the API key to the header" instead of "The API key should be added").
- **2.2 Paragraph Length**: 1-4 sentences max. One idea per paragraph. Dense blocks are forbidden.
- **2.3 Terminology Rules**: Consistent terminology. Define terms once, link to definition. Do not rename features.
- **2.4 Inclusive Language**: Use "allowlist"/"denylist", "primary"/"secondary". Avoid gendered/ableist language.
- **2.5 Formatting Rules**: Sentence case for headings. **Bold** for UI labels. `Monospace` for code, file names, variables, CLI commands.

## 3. Structural Model of the World's Best Docs
Every section must follow this order:
1. **Overview**: What it does, why it matters, when to use it.
2. **Before You Begin**: Requirements, permissions, dependencies, keys.
3. **Quick Start (Under 5 Min)**: Minimal, copy-pasteable steps to success.
4. **Detailed Steps**: Edge cases, variations, platform differences.
5. **Example Requests**: curl, JS, Python, SDKs. Full working examples.
6. **Example Response**: Success, error, field explanations.
7. **Troubleshooting**: Problem → Cause → Solution format.
8. **Next Steps**: Clear actions, logical progressions.

## 4. UX Architecture
- **4.1 Search Must Be Superior**: Handle typos, intent ranking, categorized results.
- **4.2 Progressive Disclosure**: Simple for beginners, expandable deep dives for advanced users. Do not overwhelm.
- **4.3 Visual Clarity System**: Strict design system (Code blocks with copy buttons, Callouts: Info, Warning, Best Practice, Security, Performance). **Never invent new types.**

## 5. Accessibility Doctrine
- Exceed WCAG 2.1 AA.
- High contrast, keyboard navigation, screen reader support. Usable without a mouse.

## 6. Developer Experience (DX) Standards
- **6.1 Interactive API Explorer**: Live testing, editable params.
- **6.2 Multi-Language Toggle**: Switchable inline code samples.
- **6.3 Copy-Paste Integrity**: Examples must work verbatim (imports/auth included).

## 7. Cognitive Load Management
- Apply Hick's Law (limit choices), Miller's Law (chunking), Fitts's Law (large targets), Jakob's Law (familiar patterns).

## 8. Error Communication Model
- Explain what happened, why, how to fix, and provide example correction. Never just "Invalid request".

## 9. Content Governance
- Version-controlled, reviewed for UX/Eng/A11y, tested quarterly. 

## 10. Design Language Principles
- **10.1 Radical Clarity**: No cleverness/marketing voice.
- **10.2 Humble Authority**: Explain clearly. Do not boast.
- **10.3 Predictability**: Everything works the same everywhere.
- **10.4 Respect for Time**: Every extra click is a tax. Every missing example is a betrayal.

## 11 & 12. Final Commandments
- No marketing language.
- No vague steps.
- No broken code samples.
- Every page structured identically.
- New developer succeeds in <10 minutes.
- Every interaction feels intentional.
