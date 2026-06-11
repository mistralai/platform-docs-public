import type { Meta, StoryObj } from '@storybook/react';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioItem,
  MenubarLabel,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarRadioGroup,
} from './menubar';
import React from 'react';

const meta: Meta<typeof Menubar> = {
  title: 'UI/Menubar',
  component: Menubar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Menubar>;

export const Default: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Project</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New API key <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Import configuration <MenubarShortcut>⌘I</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Workspace settings <MenubarShortcut>⌘,</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Models</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Mistral Large</MenubarItem>
          <MenubarItem>Mistral Small</MenubarItem>
          <MenubarItem>Devstral</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Fine-tuned models</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Help</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Documentation</MenubarItem>
          <MenubarItem>API reference</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Contact support</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

export const WithCheckboxItems: Story = {
  render: () => {
    const [showToolbar, setShowToolbar] = React.useState(true);
    const [showSidebar, setShowSidebar] = React.useState(false);
    const [showConsole, setShowConsole] = React.useState(true);

    return (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>Panels</MenubarLabel>
            <MenubarSeparator />
            <MenubarCheckboxItem
              checked={showToolbar}
              onCheckedChange={setShowToolbar}
            >
              Toolbar
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              checked={showSidebar}
              onCheckedChange={setShowSidebar}
            >
              Sidebar
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              checked={showConsole}
              onCheckedChange={setShowConsole}
            >
              Console
            </MenubarCheckboxItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
  },
};

export const WithRadioItems: Story = {
  render: () => {
    const [model, setModel] = React.useState('mistral-large');

    return (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Model</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>Select model</MenubarLabel>
            <MenubarSeparator />
            <MenubarRadioGroup value={model} onValueChange={setModel}>
              <MenubarRadioItem value="mistral-large">
                Mistral Large
              </MenubarRadioItem>
              <MenubarRadioItem value="mistral-small">
                Mistral Small
              </MenubarRadioItem>
              <MenubarRadioItem value="devstral">Devstral</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
  },
};

export const WithSubmenus: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Project <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Export</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>JSON</MenubarItem>
              <MenubarItem>YAML</MenubarItem>
              <MenubarItem>Python</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            Close <MenubarShortcut>⌘W</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Copy endpoint <MenubarShortcut>⌘C</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Paste configuration <MenubarShortcut>⌘V</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Deploy</MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>Region</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>EU West (Paris)</MenubarItem>
              <MenubarItem>US East (Virginia)</MenubarItem>
              <MenubarItem>AP Southeast (Singapore)</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            Deploy now <MenubarShortcut>⌘D</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

export const WithDestructiveItem: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Workspace</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Members</MenubarItem>
          <MenubarItem>Billing</MenubarItem>
          <MenubarItem>Usage</MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant="destructive">Delete Workspace</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};
