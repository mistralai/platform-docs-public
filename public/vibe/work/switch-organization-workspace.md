---
title: Switch Organization or Workspace
sidebar_position: 9
---

# Switch Organization or Workspace

Your Mistral account belongs to one or more **Organizations**, and each Organization contains one or more **Workspaces**. A Workspace is an **isolation boundary**: use it to keep resources separate between departments, projects, or environments. It is not a team-management container.

:::info
Workspaces are shared across Vibe, Studio, and the Admin Panel: the same Workspace entity is visible in all three. In Vibe Work, switching Workspace changes which scope you're working in. See [Organizations and Workspaces](/admin/workspaces/organization-vs-workspaces) for the admin view.
:::

<SectionTab as="h2" sectionId="switcher">Switch from the sidebar</SectionTab>

Click your **Organization name** in the bottom-left corner of the Vibe app, next to your initials. The popover shows:

- Your current **Workspace** (named **Default Workspace** if the Organization has only one).
- Other Workspaces in the same Organization.
- Other Organizations you belong to.

Pick a Workspace to switch directly. Pick an Organization to land on its default Workspace.

:::note
If your account only has access to one Workspace, the switcher is hidden. Nothing to do.
:::

:::warning
Switching Workspace switches **all open tabs** (single session per user). Open separate browser profiles if you need to work in two Workspaces at once.
:::

<SectionTab as="h2" sectionId="scoped">Everything is scoped per Workspace</SectionTab>

When you switch Workspace, your view in Vibe Work resets. The following resources stay where you created them and **are not shared across Workspaces**:

- Chat history
- [Projects](/vibe/work/projects)
- [Skills](/vibe/work/skills) (personal and Workspace-published)
- [Scheduled tasks](/vibe/work/scheduled-tasks)
- [Custom instructions](/vibe/work/custom-instructions)
- Connector authentications

If you need any other resource in another Workspace, you have to recreate it there.

:::info
[Libraries](/vibe/work/libraries) are also scoped per Workspace by default, but your Organization admin can allow Org-level sharing so a Library is visible across all Workspaces in the Organization.
:::

<SectionTab as="h2" sectionId="admin-config">Workspace-level admin settings</SectionTab>

Some Vibe Work behavior is configured per Workspace by Organization Admins:

- **Available tools**: which Vibe Work tools and Connectors are enabled.
- **User access and roles**: who can join the Workspace and at what role.
- **Usage metrics**: per-Workspace usage tracking.

If a feature is missing or behaves differently between Workspaces, this is usually why. Reach out to your Organization admin to adjust settings, or see [Organizations and Workspaces](/admin/workspaces/organization-vs-workspaces) for the configuration details.

:::tip
More granular sharing of individual resources with specific users or groups, without requiring a Workspace switch, is on the roadmap.
:::