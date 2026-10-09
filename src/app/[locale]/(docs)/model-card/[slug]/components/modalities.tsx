import {
  ChatIcon,
  PictureIcon,
  LampIcon,
  PageIcon,
  CalculatorIcon,
  ChevronRightIcon,
  ScanIcon,
} from '@/components/icons/pixel';
import MicrophoneIcon from '@/components/icons/pixel/microphone';
import { ModalityKey } from '@/schema/models';
import { modalityLabel } from '@/schema/models/i18n';
import { getLingo } from '@/i18n/server';
import { Link } from '@/i18n/navigation.client';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Locale } from '@/i18n/config';

const OUTPUT_MODALITY_LINKS: Partial<Record<ModalityKey, string>> = {
  reasoning: '/studio/conversations/reasoning',
  text: '/studio/conversations/chat-completion',
};

interface ModalitiesSectionProps {
  inputCapabilities: ModalityKey[];
  outputCapabilities: ModalityKey[];
  locale: Locale;
}

export async function Modalities({
  inputCapabilities,
  outputCapabilities,
  locale,
}: ModalitiesSectionProps) {
  const l = await getLingo(locale);
  const capabilityIcons = {
    text: ChatIcon,
    image: PictureIcon,
    vision: PictureIcon,
    audio: MicrophoneIcon,
    document: PageIcon,
    reasoning: LampIcon,
    embeddings: ScanIcon,
    scores: CalculatorIcon
  };

  const renderModalityIcon = (
    modality: ModalityKey,
    direction: 'input' | 'output'
  ) => {
    const IconComponent =
      capabilityIcons[modality as keyof typeof capabilityIcons];

    if (!IconComponent) return null;

    const name = modalityLabel(modality, l);
    const tooltipText =
      direction === 'input'
        ? l.text('{name} input', {
            context:
              'Tooltip for an input modality',
            values: { name },
          })
        : l.text('{name} output', {
            context:
              'Tooltip for an output modality',
            values: { name },
          });

    const link = direction === 'output' ? OUTPUT_MODALITY_LINKS[modality] : undefined;

    const icon = <IconComponent className="size-6 text-primary-soft" />;

    return (
      <Tooltip key={modality}>
        <TooltipTrigger asChild>
          <span className="inline-block">
            {link ? (
              <Link href={link} className="inline-block hover:opacity-80 transition-opacity">
                {icon}
              </Link>
            ) : (
              icon
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent>{tooltipText}</TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div className="flex items-center gap-1.5">
      {/* Input icons */}
      <div className="flex items-center gap-1">
        {inputCapabilities.map(modality =>
          renderModalityIcon(modality, 'input')
        )}
      </div>

      {/* Arrow separator */}
      <div className="flex -space-x-2.5 opacity-20">
        {Array.from({ length: 3 }).map((_, index) => (
          <ChevronRightIcon key={index} className="size-4 text-foreground" />
        ))}
      </div>

      {/* Output icons */}
      <div className="flex items-center gap-1">
        {outputCapabilities.map(modality =>
          renderModalityIcon(modality, 'output')
        )}
      </div>
    </div>
  );
}
