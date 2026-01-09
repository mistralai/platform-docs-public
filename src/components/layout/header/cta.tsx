import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRightIcon } from '@/components/icons/pixel';
import { MISTRAL_URL_ORIGIN } from '@/lib/constants';

export const HeaderCta = (props: React.ComponentProps<typeof Button>) => {
  return (
    <Button asChild {...props}>
      <Link href={`${MISTRAL_URL_ORIGIN}/contact `}>
        Reach out
        <ArrowRightIcon className="size-5" />
      </Link>
    </Button>
  );
};
