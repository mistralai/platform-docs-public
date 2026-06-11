import type { Meta, StoryObj } from '@storybook/react';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from './navigation-menu';
import React from 'react';

const meta: Meta<typeof NavigationMenu> = {
  title: 'UI/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NavigationMenu>;

export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Models</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:grid-cols-2">
              <li>
                <NavigationMenuLink asChild>
                  <a
                    href="/models/mistral-large"
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none"
                  >
                    <div className="text-sm font-medium">Mistral Large</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Our most capable model for complex reasoning tasks.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    href="/models/mistral-small"
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none"
                  >
                    <div className="text-sm font-medium">Mistral Small</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Fast and efficient for everyday tasks.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    href="/models/devstral"
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none"
                  >
                    <div className="text-sm font-medium">Devstral</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Built for software development and code generation.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Capabilities</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:grid-cols-2">
              <li>
                <NavigationMenuLink asChild>
                  <a
                    href="/capabilities/function-calling"
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none"
                  >
                    <div className="text-sm font-medium">Function calling</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Let models call your APIs with structured JSON output.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    href="/capabilities/json-mode"
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none"
                  >
                    <div className="text-sm font-medium">JSON mode</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Guaranteed valid JSON output for structured data.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
            <a href="/api">API reference</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

export const WithoutViewport: Story = {
  render: () => (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Deployment</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-3 p-4">
              <li>
                <NavigationMenuLink asChild>
                  <a
                    href="/deploy/cloud"
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none"
                  >
                    <div className="text-sm font-medium">Cloud</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Deploy on our managed infrastructure.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    href="/deploy/self-hosted"
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none"
                  >
                    <div className="text-sm font-medium">Self-hosted</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Run models on your own infrastructure.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

export const LinksOnly: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
            <a href="/docs">Documentation</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
            <a href="/api">API reference</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
            <a href="/changelog">Changelog</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};
