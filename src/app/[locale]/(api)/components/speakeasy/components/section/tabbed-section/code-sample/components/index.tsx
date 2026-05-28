'use client';
import {
  $multiCodeBlockContent,
  $multiCodeBlockWrapper,
} from '@/components/common/multi-codeblock.styles';
import { tabsListVariants } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { SectionContentProps } from '@speakeasy-api/docs-md-react';
import { useReponseActiveTab } from '../../response-example';

export const TabbedSectionWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div data-type="tabbed-section" className={$multiCodeBlockWrapper()}>
      <div data-slot="tabs" className="flex flex-col gap-0">
        {children}
      </div>
    </div>
  );
};

export const TabbedSectionTabs = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div
      data-slot="tabs-list"
      className={cn(tabsListVariants({ variant: 'code' }))}
      slot="title"
    >
      {children}
    </div>
  );
};

export const SectionContent = ({
  children,
  lang,
  ...props
}: {
  children: React.ReactNode;
} & SectionContentProps & {
    lang?: string | undefined;
    ['data-language']?: string | undefined;
  }) => {
  const language = lang || props['data-language'];
  const context = useReponseActiveTab();

  return (
    <div
      {...(language && { 'data-language': language })}
      data-slot="tabs-content"
      className={cn(
        "flex-1 outline-none relative rounded-t-none [&_[data-type='code']_pre]:max-h-[400px] [&_[data-type='code']_pre]:overflow-y-auto [&_[data-type='code']_pre]:scrollbar-thin",
        language && 'speakeasy-code-tab'
      )}
      style={
        context
          ? {
              display: context.activeTab === props.id ? 'block' : 'none',
            }
          : undefined
      }
      {...props}
    >
      {children}
    </div>
  );
};

export const SectionContentWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div
      data-type="tabbed-section-content"
      className={$multiCodeBlockContent({
        outputTab: false,
      })}
    >
      {children}
    </div>
  );
};
