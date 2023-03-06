import NextLink from 'next/link';
import { forwardRef, type ReactNode } from 'react';

import { LinkItem } from 'lib/types/common';

type LinkProps = Omit<LinkItem, 'text'> & {
  children: ReactNode;
  className?: string;
};

const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ children, current, external, ...rest }, ref) =>
  external ? (
    <a {...rest} ref={ref} rel="noreferrer noopener" target="_blank">
      {children}
    </a>
  ) : (
    <NextLink {...rest} ref={ref} aria-current={current ? 'page' : 'false'}>
      {children}
    </NextLink>
  ),
);

export { Link };
