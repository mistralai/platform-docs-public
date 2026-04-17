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
              '≈ GPU RAM at bf16 - fp4 (GB)',
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
    <div className={cn('flex gap-2 items-center justify-end text-end', className)}>
      <span className={cn('font-mono text-sm text-foreground font-semibold')}>
        {(() => {
          // Extract all non-null values from minGpuRam and convert them to numbers
          const values = [
            minGpuRam.bf16 !== null ? parseFloat(minGpuRam.bf16) : null,
            minGpuRam.fp8 !== null ? parseFloat(minGpuRam.fp8) : null,
            minGpuRam.fp4 !== null ? parseFloat(minGpuRam.fp4) : null,
            minGpuRam.fp4_16 !== null ? parseFloat(minGpuRam.fp4_16) : null,
          ].filter((val): val is number => val !== null); // Type guard to ensure only numbers remain

          if (values.length === 0) return "N/A"; // Fallback if all values are null

          const max = Math.max(...values);
          const min = Math.min(...values);

          return `${max} - ${min}`;
        })()}
      </span>
      <Tooltip>
        <TooltipTrigger className="flex items-center gap-1 justify-end">
          <InfoHint />
        </TooltipTrigger>
        <TooltipContent align="end" side="top" arrowClassName="">
          <div className="flex flex-col gap-1 max-w-[160px]">
            <p className="mt-3">
              Approximate minimum required GB for different quantization formats.
            </p>
            {minGpuRam.bf16 !== null && (
              <p>
                <strong> - BF16 & Full Context:</strong> {minGpuRam.bf16}
              </p>
            )}
            {minGpuRam.fp8 !== null && (
              <p>
                <strong> - FP8 & 1/2 Context:</strong> {minGpuRam.fp8}
              </p>
            )}
            {minGpuRam.fp4 !== null && (
              <p>
                <strong> - FP4 & 1/4 context:</strong> {minGpuRam.fp4}
              </p>
            )}
            {minGpuRam.fp4_16 !== null && (
              <p>
                <strong> - FP4 & 16k context:</strong> {minGpuRam.fp4_16}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
