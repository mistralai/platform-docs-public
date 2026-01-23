import { cn } from '@/lib/utils';
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
import { ModalityKey, AVAILABLE_MODALITIES } from '@/schema/models';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CapabilitySectionProps {
  label: string;
  capabilities: string[];
  Icon: React.ComponentType<{ className?: string }>;
  allCapabilities?: ModalityKey[];
}

interface ModalitiesSectionProps {
  inputCapabilities: ModalityKey[];
  outputCapabilities: ModalityKey[];
}

export function Modalities({
  inputCapabilities,
  outputCapabilities,
}: ModalitiesSectionProps) {
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
    const modalityInfo = AVAILABLE_MODALITIES[modality];

    if (!IconComponent) return null;

    return (
      <Tooltip key={modality}>
        <TooltipTrigger asChild>
          <span className="inline-block">
            <IconComponent className="size-6 text-primary-soft" />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {modalityInfo.name} {direction}
        </TooltipContent>
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
