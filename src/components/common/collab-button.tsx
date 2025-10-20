import { Button } from '@/components/ui/button';
import CollabLogo from '../icons/collab';

export function CollabButton({ colabUrl }: { colabUrl: string }) {
  return (
    <Button
      size={'sm'}
      variant="outline"
      className="uppercase self-start not-prose"
      asChild
    >
      <a href={colabUrl} target="_blank" rel="noopener noreferrer">
        <CollabLogo className="size-4 text-primary" />
        <span className="max-md:hidden">Open in</span> Colab ↗
      </a>
    </Button>
  );
}
