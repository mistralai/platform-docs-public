import type { ReactNode } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/navigation.client';
import { ArrowRightIcon, CheckIcon } from '@/components/icons/pixel';
import type { ReleaseNote } from './types';

const dateFormatter = new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

function formatDate(date: string) {
  return dateFormatter.format(new Date(`${date}T00:00:00.000Z`));
}

function MetaBadge({ children }: { children: ReactNode }) {
  return (
    <Badge
      variant="outline"
      size="sm"
      className="border-border/80 bg-background/80 text-muted-foreground"
    >
      {children}
    </Badge>
  );
}

function InlineCodeText({ children }: { children: string }) {
  const parts = children.split(/(`[^`]+`)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={`${part}-${index}`}
              className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em] text-foreground"
            >
              {part.slice(1, -1)}
            </code>
          );
        }

        return <span key={`${part}-${index}`}>{part}</span>;
      })}
    </>
  );
}

function resolveMediaUrl(url: string, locale = 'en') {
  if (url.startsWith('http') || url.startsWith('/')) {
    return url;
  }

  return `/assets/releases/${locale}/${url}`;
}

export function ReleaseNoteCard({
  note,
  locale = 'en',
}: {
  note: ReleaseNote;
  locale?: string;
}) {
  const cta = note.getStarted;

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card p-6">
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex max-w-3xl flex-col gap-3">
            <p className="m-0 font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <time dateTime={note.date}>{formatDate(note.date)}</time>
            </p>
            <h2 className="m-0 text-2xl font-black leading-tight tracking-tight text-foreground md:text-3xl">
              {note.title}
            </h2>
            <p className="m-0 text-base leading-7 text-muted-foreground">
              {note.summary}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2 lg:max-w-72 lg:justify-end">
            <MetaBadge>{note.type}</MetaBadge>
            <MetaBadge>{note.area}</MetaBadge>
            <MetaBadge>{note.availability}</MetaBadge>
            <MetaBadge>{note.hosting}</MetaBadge>
          </div>
        </header>

        <details className="group/details [&_summary::-webkit-details-marker]:hidden">
          <summary className="inline-flex w-fit cursor-pointer select-none rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
            <span className="group-open/details:hidden">Learn more</span>
            <span className="hidden group-open/details:inline">Show less</span>
          </summary>

          <div className="mt-6 flex flex-col gap-6">
            {note.media?.type === 'image' && (
              <figure className="relative m-0 overflow-hidden rounded-xl border border-border/70 bg-muted">
                <Image
                  src={resolveMediaUrl(note.media.url, locale)}
                  alt=""
                  width={1200}
                  height={675}
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full scale-125 object-cover opacity-45 blur-3xl"
                  sizes="(min-width: 1024px) 896px, 100vw"
                />
                <div className="absolute inset-0 bg-background/20" />
                <Image
                  src={resolveMediaUrl(note.media.url, locale)}
                  alt={note.media.alt ?? note.title}
                  width={1200}
                  height={675}
                  className="relative max-h-[28rem] w-full object-contain"
                  sizes="(min-width: 1024px) 896px, 100vw"
                />
              </figure>
            )}

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.8fr)]">
              <section className="rounded-xl border border-border/70 bg-background/60 p-5">
                <h3 className="m-0 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  What's new
                </h3>
                <p className="mb-0 mt-3 text-sm leading-relaxed text-foreground/85">
                  <InlineCodeText>{note.whatsNew}</InlineCodeText>
                </p>
              </section>

              <section className="rounded-xl border border-border/70 bg-background/60 p-5">
                <h3 className="m-0 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  Key capabilities
                </h3>
                <ul className="m-0 mt-3 flex list-none flex-col gap-3 p-0">
                  {note.keyCapabilities.map(capability => (
                    <li key={capability} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#0082E6]/10 text-[#0082E6]">
                        <CheckIcon className="size-3" />
                      </span>
                      <span><InlineCodeText>{capability}</InlineCodeText></span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {cta && (
              <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-background/60 p-5">
                <h3 className="m-0 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  Get started
                </h3>
                <p className="m-0 text-sm leading-relaxed text-foreground/85">
                  <InlineCodeText>{cta.label}</InlineCodeText>
                </p>
                {cta.href && (
                  <Link
                    href={cta.href.url}
                    className="inline-flex w-fit items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground no-underline transition-colors hover:bg-primary/90 hover:no-underline"
                    target={cta.href.url.startsWith('http') ? '_blank' : undefined}
                    rel={cta.href.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    <span>{cta.href.label}</span>
                    <span className="flex size-4 items-center justify-center">
                      <ArrowRightIcon className="size-4" />
                    </span>
                  </Link>
                )}
              </div>
            )}
          </div>
        </details>
      </div>
    </article>
  );
}
