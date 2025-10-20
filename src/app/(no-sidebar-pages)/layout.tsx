import PageContent from '@/components/layout/page-content';
import { DocsVariantProvider } from '@/contexts/docs-variant';

export default function NoSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageContent className="flex-1 mx-sides px-inner-sides" as="main">
      <DocsVariantProvider variant="docs">{children}</DocsVariantProvider>
    </PageContent>
  );
}
