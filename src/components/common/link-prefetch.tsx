import { Link } from '@/i18n/navigation.client';
import * as React from 'react';
import { useState } from 'react';

export const LinkPrefetch = ({
  children,
  prefetch: _ = 'onHover',
  ...props
}: Omit<React.ComponentProps<typeof Link>, 'prefetch'> & {
  children: React.ReactNode;
  prefetch?: boolean | 'onHover';
}) => {
  const [active, setActive] = useState(false);

  return (
    <Link
      prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
      {...props}
    >
      {children}
    </Link>
  );
};
