const illustrations = {
  rocket: { x: 1440, y: 815, width: 120, height: 155 },
  terminal: { x: 2494, y: 833, width: 120, height: 115 },
  chest: { x: 2845, y: 825, width: 125, height: 140 },
  castle: { x: 1598, y: 825, width: 155, height: 125 },
  tree: { x: 1086, y: 817, width: 135, height: 145 },
  scroll: { x: 748, y: 825, width: 105, height: 135 },
  flower: { x: 1794, y: 829, width: 110, height: 125 },
  dragon: { x: 2674, y: 813, width: 115, height: 165 },
} as const;

type IllustrationName = keyof typeof illustrations;

export function PixelIllustration({
  name,
  className,
}: {
  name: IllustrationName;
  className?: string;
}) {
  const { x, y, width, height } = illustrations[name];
  return (
    <svg
      viewBox={`${x} ${y} ${width} ${height}`}
      className={className}
      aria-hidden="true"
    >
      <image href="/assets/pixel-sprites.svg" width="3524" height="1290" />
    </svg>
  );
}
