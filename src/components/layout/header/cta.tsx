import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation.client';

interface HeaderCtaProps extends React.ComponentProps<typeof Button> {
  href: string;
  target?: string;
  children?: React.ReactNode;
}

export const HeaderCta = ({ href, children, target, ...props }: HeaderCtaProps) => {
  return (
    <Button asChild {...props}>
      <Link href={href} target={target}>
        {children}
      </Link>
    </Button>
  );
};
