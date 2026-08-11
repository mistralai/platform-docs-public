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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Locale } from '@/i18n/config';

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
    const tooltip =
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

    return (
      <Tooltip key={modality}>
        <TooltipTrigger asChild>
          <span className="inline-block">
            <IconComponent className="size-6 text-primary-soft" />
          </span>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
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
