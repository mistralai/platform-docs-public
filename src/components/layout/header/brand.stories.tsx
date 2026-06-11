import type { Meta, StoryObj } from '@storybook/react';
import { BrandContextMenu } from './brand';
import React from 'react';

const meta: Meta<typeof BrandContextMenu> = {
  title: 'Layout/BrandContextMenu',
  component: BrandContextMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Right-click context menu for the Mistral brand logo. Provides options to copy the logo as SVG, download it, visit brand guidelines, or go to the homepage.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof BrandContextMenu>;

export const Default: Story = {
  render: () => (
    <BrandContextMenu>
      <div className="inline-flex items-center justify-center size-10 bg-muted rounded-md cursor-pointer select-none">
        <svg
          className="size-6"
          viewBox="0 0 365 258"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M104.107 0H52.0525V51.57H104.107V0Z" fill="#FFD800" />
          <path d="M312.351 0H260.296V51.57H312.351V0Z" fill="#FFD800" />
          <path d="M156.161 51.5701H52.0525V103.14H156.161V51.5701Z" fill="#FFAF00" />
          <path d="M312.353 51.5701H208.244V103.14H312.353V51.5701Z" fill="#FFAF00" />
          <path d="M312.356 103.14H52.0525V154.71H312.356V103.14Z" fill="#FF8205" />
          <path d="M104.107 154.71H52.0525V206.28H104.107V154.71Z" fill="#FA500F" />
          <path d="M208.228 154.711H156.174V206.281H208.228V154.711Z" fill="#FA500F" />
          <path d="M312.351 154.711H260.296V206.281H312.351V154.711Z" fill="#FA500F" />
          <path d="M156.195 206.312H0V257.882H156.195V206.312Z" fill="#E10500" />
          <path d="M364.439 206.312H208.244V257.882H364.439V206.312Z" fill="#E10500" />
        </svg>
      </div>
    </BrandContextMenu>
  ),
};

export const WithText: Story = {
  render: () => (
    <BrandContextMenu>
      <div className="inline-flex items-center gap-2 px-3 py-2 bg-muted rounded-md cursor-pointer select-none">
        <svg
          className="size-5"
          viewBox="0 0 365 258"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M104.107 0H52.0525V51.57H104.107V0Z" fill="#FFD800" />
          <path d="M312.351 0H260.296V51.57H312.351V0Z" fill="#FFD800" />
          <path d="M156.161 51.5701H52.0525V103.14H156.161V51.5701Z" fill="#FFAF00" />
          <path d="M312.353 51.5701H208.244V103.14H312.353V51.5701Z" fill="#FFAF00" />
          <path d="M312.356 103.14H52.0525V154.71H312.356V103.14Z" fill="#FF8205" />
          <path d="M104.107 154.71H52.0525V206.28H104.107V154.71Z" fill="#FA500F" />
          <path d="M208.228 154.711H156.174V206.281H208.228V154.711Z" fill="#FA500F" />
          <path d="M312.351 154.711H260.296V206.281H312.351V154.711Z" fill="#FA500F" />
          <path d="M156.195 206.312H0V257.882H156.195V206.312Z" fill="#E10500" />
          <path d="M364.439 206.312H208.244V257.882H364.439V206.312Z" fill="#E10500" />
        </svg>
        <span className="font-bold text-sm">Mistral AI</span>
      </div>
    </BrandContextMenu>
  ),
};
