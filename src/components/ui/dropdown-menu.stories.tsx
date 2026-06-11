import type { Meta, StoryObj } from '@storybook/react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from './dropdown-menu';
import { Button } from './button';
import React from 'react';

const meta: Meta<typeof DropdownMenu> = {
  title: 'UI/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            API keys
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Workspace settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithCheckboxItems: Story = {
  render: () => {
    const [showUsage, setShowUsage] = React.useState(true);
    const [showLogs, setShowLogs] = React.useState(false);
    const [showAlerts, setShowAlerts] = React.useState(true);

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Dashboard settings</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Visible panels</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={showUsage}
            onCheckedChange={setShowUsage}
          >
            Token usage
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showLogs}
            onCheckedChange={setShowLogs}
          >
            Request logs
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showAlerts}
            onCheckedChange={setShowAlerts}
          >
            Rate limit alerts
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export const WithRadioItems: Story = {
  render: () => {
    const [model, setModel] = React.useState('mistral-large');

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Select model</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Model</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={model} onValueChange={setModel}>
            <DropdownMenuRadioItem value="mistral-large">
              Mistral Large
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="mistral-small">
              Mistral Small
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="devstral">
              Devstral
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export const WithSubmenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>New API key</DropdownMenuItem>
        <DropdownMenuItem>View usage</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Deploy model</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Mistral Large</DropdownMenuItem>
            <DropdownMenuItem>Mistral Small</DropdownMenuItem>
            <DropdownMenuItem>Devstral</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Custom fine-tuned model</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>Delete Workspace</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithInsetItems: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Workspace</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel inset>Workspace options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem inset>Members</DropdownMenuItem>
        <DropdownMenuItem inset>Connectors</DropdownMenuItem>
        <DropdownMenuItem inset>Libraries</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem inset disabled>
          Transfer ownership
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
