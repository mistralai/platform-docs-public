---
title: Skills
sidebar_position: 9
---

# Skills

Skills are **reusable instruction sets** that extend Vibe Code with new workflows, custom slash commands, and scoped tool sets. Vibe follows the [Agent Skills specification](https://agentskills.io/specification), so skills you write here are portable to other agents that adopt the same spec.

<SectionTab as="h2" sectionId="skill-format">Skill format</SectionTab>

A skill is a **directory containing a `SKILL.md` file**. The file starts with YAML frontmatter and continues with the skill instructions in Markdown.

```markdown
---
name: code-review
description: Perform automated code reviews.
license: MIT
compatibility: Python 3.12+
user-invocable: true
allowed-tools:
  - read_file
  - grep
  - ask_user_question
---

# Code review skill

This skill helps analyze code quality and suggest improvements.
```

Common frontmatter fields:

- **`name`**: used to invoke the skill.
- **`description`**: shown in the skill list.
- **`user-invocable`**: when `true`, exposes the skill as a slash command in the CLI and the VS Code extension.
- **`allowed-tools`**: restricts which tools the skill can call.

<SectionTab as="h2" sectionId="locations">Skill locations</SectionTab>

The CLI discovers skills from several locations, in order:

1. **Custom paths** defined in `config.toml` → `skill_paths = ["/path/to/custom/skills"]`
2. **Project-level** skills in `./.vibe/skills/` or `./.agents/skills/` when the working directory is [trusted](/vibe/code/safety-approvals-permissions#trusted-folders).
3. **User-level** skills in `~/.vibe/skills/`.

<SectionTab as="h2" sectionId="filtering">Enable, disable, or filter skills</SectionTab>

Use patterns to control which skills load:

```toml
enabled_skills = ["code-review", "test-*"]
disabled_skills = ["experimental-*"]
```

Skill filters support **exact names**, **glob patterns**, and **regex** with the `re:` prefix, just like tool filters. If `enabled_skills` is non-empty, it acts as an allow-list; otherwise every discovered skill is available minus those matched by `disabled_skills`.

<SectionTab as="h2" sectionId="slash-commands">Custom slash commands</SectionTab>

Skills are the recommended way to add your own slash commands. Set `user-invocable: true` in the frontmatter and the skill name becomes available with `/skill-name` autocompletion in the CLI prompt, and in the [VS Code extension](/vibe/code/vs-code-extension/commands-slash-commands#slash-commands) slash picker too.

Pair custom skills with `allowed-tools` to keep their access scoped to what the workflow needs.

{/* TODO (devs): confirm whether all user-invocable skills appear in the slash menu by default, or whether they must be enabled per project. Also confirm exact arg-passing syntax for skills that take input. */}

<SectionTab as="h2" sectionId="stay-in-control">Stay in control</SectionTab>

- **Review a skill before enabling it** if it can call write-capable tools.
- Prefer **narrow `allowed-tools` lists** over disabling tools elsewhere.
- Keep project-specific skills in `./.vibe/skills/` so collaborators can review them in code review.