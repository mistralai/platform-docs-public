import type { Meta, StoryObj } from '@storybook/react';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
} from './context-menu';
import React from 'react';

const meta: Meta<typeof ContextMenu> = {
  title: 'UI/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ContextMenu>;

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem>
          Copy API key
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Regenerate key
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>View usage</ContextMenuItem>
        <ContextMenuItem>Edit permissions</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">Revoke key</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const WithCheckboxItems: Story = {
  render: () => {
    const [streaming, setStreaming] = React.useState(true);
    const [jsonMode, setJsonMode] = React.useState(false);
    const [safePrompt, setSafePrompt] = React.useState(true);

    return (
      <ContextMenu>
        <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
          Right-click for options
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuLabel>Request options</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem
            checked={streaming}
            onCheckedChange={setStreaming}
          >
            Enable streaming
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={jsonMode}
            onCheckedChange={setJsonMode}
          >
            JSON mode
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={safePrompt}
            onCheckedChange={setSafePrompt}
          >
            Safe prompt
          </ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
};

export const WithRadioItems: Story = {
  render: () => {
    const [region, setRegion] = React.useState('eu-west');

    return (
      <ContextMenu>
        <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
          Right-click to select region
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuLabel>Deployment region</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuRadioGroup value={region} onValueChange={setRegion}>
            <ContextMenuRadioItem value="eu-west">
              EU West (Paris)
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="us-east">
              US East (Virginia)
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="ap-southeast">
              AP Southeast (Singapore)
            </ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
};

export const WithSubmenu: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
        Right-click for actions
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem>New Agent</ContextMenuItem>
        <ContextMenuItem>Import configuration</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>Add Connector</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>Google Drive</ContextMenuItem>
            <ContextMenuItem>Confluence</ContextMenuItem>
            <ContextMenuItem>Notion</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Custom webhook</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Export as</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>JSON</ContextMenuItem>
            <ContextMenuItem>YAML</ContextMenuItem>
            <ContextMenuItem>Python script</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem disabled>Archive</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const WithInsetLabel: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuLabel inset>Workspace actions</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem inset>Manage members</ContextMenuItem>
        <ContextMenuItem inset>Billing settings</ContextMenuItem>
        <ContextMenuItem inset>Usage dashboard</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset variant="destructive">
          Delete Workspace
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};
