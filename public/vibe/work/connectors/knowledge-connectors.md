---
title: Knowledge Connectors
sidebar_position: 1
---

# Knowledge Connectors

Google Drive and Microsoft SharePoint work differently from other [Connectors](/vibe/work/connectors). Instead of fetching data in real time, they **index your files** (process and catalog them for fast search) and store them on our platform so Work can search them instantly, similar to how [Libraries](/vibe/work/libraries) work.

This means your team can query documents across your entire drive using natural language, with results based on the actual files and respecting your existing access permissions.

:::info
Knowledge Connectors are available on **Team and Enterprise plans**. An administrator must set up indexing before users can connect.
:::

<SectionTab as="h2" sectionId="how-it-works">How it works</SectionTab>

1. An **administrator** configures the Connector and initiates indexing of your organization's files.
2. Files are indexed and stored in our European data centers.
3. Each user connects with their own account and starts querying indexed content from any task.
4. The index syncs regularly with the source. Edits, new files, and deletions at the source are reflected during each scheduled sync.

<SectionTab as="h2" sectionId="admin-setup">Administrator setup</SectionTab>

This is a one-time process. Once indexing is complete, your team can connect and start using the Connector.

<ExplorerTabs>
<ExplorerTab value="google-drive" label="Google Drive" default>

1. Go to the `Connectors` page and open the `Admin Controls` tab.
2. Find **Google Drive** and click `Setup`.
3. Review the indexing information modal and click `Setup`.
4. Follow the setup flow: sign in with your Google admin account and grant the required permissions.
5. Monitor indexing progress on the `Admin Controls` tab.

Indexing can take minutes to several hours depending on the volume of data.

:::tip
Use **selective sync** to index only specific folders instead of the entire drive. This reduces indexing time and keeps the knowledge base focused on relevant content.
:::

</ExplorerTab>
<ExplorerTab value="sharepoint" label="Microsoft SharePoint">

1. Go to the `Connectors` page and open the `Admin Controls` tab.
2. Find **Microsoft SharePoint** and click `Setup`.
3. Review the indexing information modal and click `Setup`.
4. Follow the setup flow: sign in with a **SharePoint Super Admin account** and grant the required permissions.
5. Monitor indexing progress on the `Admin Controls` tab.

Indexing can take minutes to several hours depending on the volume of data.

:::tip
Use **selective sync** to index only specific sites and libraries instead of the entire SharePoint instance. This reduces indexing time and keeps the knowledge base focused on relevant content.
:::

</ExplorerTab>
</ExplorerTabs>

<SectionTab as="h3" variant="secondary" sectionId="selective-sync">Selective sync</SectionTab>

Selective sync lets you choose exactly which folders, sites, or libraries to index. To configure it:

1. Open the `Admin Controls` tab on the `Connectors` page.
2. Click on the Connector card.
3. Browse and check/uncheck individual folders or sites to include in indexing.

To add new folders to an existing index, re-run the indexing process. New content is added to the existing index.

<SectionTab as="h3" variant="secondary" sectionId="updating-the-index">Updating the index</SectionTab>

The platform monitors changes at the source (creation, modification, deletion) and updates the index during each scheduled sync. Deleted files are removed from the index and can no longer be queried through Work.

<SectionTab as="h2" sectionId="user-connection">User connection</SectionTab>

Once your administrator has completed indexing, you can connect with your own account:

1. Open the `Connectors` page from the sidebar.
2. Find the Google Drive or SharePoint card and click `Connect`.
3. Sign in with your own Google or Microsoft account.
4. Confirm the connection.

A green `Connected` indicator confirms you're set. You can now query indexed content from any task by enabling the Connector as a tool.

:::caution
If you try to connect before indexing is complete, you'll see an error. Check with your administrator if the Connector isn't available yet.
:::

<SectionTab as="h2" sectionId="permissions">Permissions and access control</SectionTab>

We replicate user, group, and permission structures from the source system. If you don't have access to a file in Google Drive or SharePoint, you can't access it through Work either.

<SectionTab as="h3" variant="secondary" sectionId="google-drive-specifics">Google Drive specifics</SectionTab>

- Permissions are based on explicit sharing (user, group, or domain level).
- Files shared as "anyone with the link" are **not** automatically visible to your entire organization through Work. They must be explicitly shared with specific users or groups.

<SectionTab as="h3" variant="secondary" sectionId="sharepoint-specifics">SharePoint specifics</SectionTab>

- Permissions rely on **Microsoft Entra ID** groups. Older SharePoint-only groups may not be recognized.
- Files shared exclusively with external guests are generally **not** indexed.

<SectionTab as="h2" sectionId="disconnection">Disconnecting</SectionTab>

What happens when you disconnect depends on who does it:

- **A user disconnects** (from `My Connectors`): your ability to query the data is removed, but the index stays intact for other users in your organization.
- **An admin disconnects** (from `Admin Controls`): the Connector is disabled organization-wide and the indexed data is **scheduled for permanent deletion**.

Re-enabling after an admin disconnection requires a full re-setup and re-indexing.

<SectionTab as="h2" sectionId="libraries-vs-knowledge-connectors">Libraries vs. Knowledge Connectors</SectionTab>

Both give Work access to your documents, but they work differently. Pick the one that fits your situation:

| You want to... | Use |
|----------------|-----|
| Control exactly which files are available, upload them manually | **[Libraries](/vibe/work/libraries)** |
| Index your entire drive or specific folders, with automatic sync | **Knowledge Connectors** |

<SectionTab as="h2" sectionId="data-privacy">Data and privacy</SectionTab>

- Files are indexed and stored in our **European data centers**.
- The index is retained only while the knowledge Connector is active. If an admin disables the Connector, data is immediately scheduled for deletion.
- Data accessed through Connectors is **never used to train or improve our models**, regardless of your plan.
- Conversations that reference Connector data follow your plan's [data policies](https://mistral.ai/terms#privacy-policy).

For more details, see our [privacy policy](https://mistral.ai/terms#privacy-policy) and [trust center](https://trust.mistral.ai/).