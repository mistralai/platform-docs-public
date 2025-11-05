import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { isMinGpuRam, type MinGpuRam, ModelWeight } from '@/schema/models';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import InfoHint from '@/components/icons/info-hint';

interface WeightsTableProps {
  weights: ModelWeight[];
  className?: string;
}

export function WeightsTable({ weights, className }: WeightsTableProps) {
  return (
    <div className={cn('w-full', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {[
              'Weights',
              'License',
              'Parameters (B)',
              'Active (B)',
              '≈ Min GPU RAM (GB)',
              'Context Size (tokens)',
            ].map((header, i) => (
              <TableHead
                key={header}
                className={cn(
                  'font-bold text-foreground/50 text-xs 2xl:text-sm',
                  i > 1 && 'text-end'
                )}
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {weights.map((weight, index) => (
            <TableRow key={`${weight.license}-${index}`}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {weight.url ? (
                    <a
                      href={weight.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-primary-soft hover:text-primary/80 transition-colors flex items-center gap-1"
                    >
                      {weight.name}
                      <span className="font-mono">↗</span>
                    </a>
                  ) : (
                    <span className="text-muted-foreground">{weight.name}</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {weight.licenseUrl ? (
                    <a
                      href={weight.licenseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-primary-soft hover:text-primary/80 transition-colors flex items-center gap-1"
                    >
                      {weight.license}
                      <span className="font-mono">↗</span>
                    </a>
                  ) : (
                    <span className="text-muted-foreground">{weight.name}</span>
                  )}
                </div>
              </TableCell>
              {['parameters', 'active', 'minGpuRam', 'contextSize'].map(
                (field, i) => (
                  <TableCell key={field} className="text-end">
                    <WeightsSwitchTableCellValue
                      value={weight[field as keyof typeof weight]}
                      className="font-mono text-sm text-foreground font-semibold"
                    />
                  </TableCell>
                )
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const WeightsSwitchTableCellValue = ({
  value,
  className,
}: {
  value: ModelWeight[keyof ModelWeight];
  className?: string;
}) => {
  if (value === undefined) {
    return <span className={cn(className)}></span>;
  }
  if (isMinGpuRam(value)) {
    return <MinGpuRam minGpuRam={value as MinGpuRam} className={className} />;
  }
  return <span className={cn(className)}>{value}</span>;
};

const MinGpuRam = ({
  minGpuRam,
  className,
}: {
  minGpuRam: MinGpuRam;
  className?: string;
}) => {
  return (
    <div
      className={cn('flex gap-2 items-center justify-end text-end', className)}
    >
      <span className={cn('font-mono text-sm text-foreground font-semibold')}>
        {minGpuRam.bf16}
      </span>
      <Tooltip>
        <TooltipTrigger className="flex items-center gap-1 justify-end">
          <InfoHint />
        </TooltipTrigger>
        <TooltipContent align="end" side="top" arrowClassName="">
          <div className="flex flex-col gap-1 max-w-[160px]">
            <p className="mt-3">
              Approximate minimum required for{' '}
              <strong className="font-bold text-">BF16</strong> & <strong className="font-bold text-">Full</strong> context.
            </p>
            <p>Other formats:</p>
            <p>
              <strong> - FP8 & 1/2 Context:</strong> {minGpuRam.fp8}GB
            </p>
            <p>
              <strong> - FP4 & 1/4 context:</strong> {minGpuRam.fp4}GB
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
