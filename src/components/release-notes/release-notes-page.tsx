import { Heading, HeadingTitle } from '@/components/layout/heading';
import { SectionTab } from '@/components/layout/section-tab';
import { getReleaseNotes } from '@/data/releases';
import type { Locale } from '@/i18n/config';
import { ReleaseNotesList } from './release-notes-list';

export function ReleaseNotesPage({ locale }: { locale: Locale }) {
  const releaseNotes = getReleaseNotes(locale);
  const isFrench = locale === 'fr';

  return (
    <div className="space-y-14 not-prose">
      <Heading className="max-w-3xl !mt-4">
        <HeadingTitle className="text-balance" size="h1" as="h1">
          {isFrench ? 'Notes de version' : 'Release notes'}
        </HeadingTitle>
        <p className="text-lg text-muted-foreground">
          {isFrench
            ? "Suivez les nouveautés livrées dans Vibe, Studio, Admin, les modèles et l'API."
            : 'Follow shipped product updates across Vibe, Studio, Admin, models, and the API.'}
        </p>
      </Heading>

      <section id="latest-updates" className="flex flex-col gap-6">
        <SectionTab sectionId="latest-updates">
          {isFrench ? 'Dernières mises à jour' : 'Latest updates'}
        </SectionTab>
        <ReleaseNotesList notes={releaseNotes} locale={locale} />
      </section>
    </div>
  );
}
