const brandMs = {
  'le-chat': { x: 560, y: 30, width: 160, height: 120 },
  studio: { x: 375, y: 375, width: 140, height: 140 },
  vibe: { x: 12, y: 410, width: 140, height: 105 },
  mistral: { x: 722, y: 30, width: 175, height: 120 },
  admin: { x: 904, y: 352, width: 175, height: 160 },
} as const;

type BrandMVariant = keyof typeof brandMs;

export function BrandM({
  variant,
  className,
}: {
  variant: BrandMVariant;
  className?: string;
}) {
  const { x, y, width, height } = brandMs[variant];
  return (
    <svg
      viewBox={`${x} ${y} ${width} ${height}`}
      className={className}
      aria-hidden="true"
    >
      <image href="/assets/brand-ms.svg" width="1436" height="2346" />
    </svg>
  );
}
