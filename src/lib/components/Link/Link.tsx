import NextLink from 'next/link';
import { forwardRef, type ReactNode } from 'react';

export type LinkProps = {
  children: ReactNode;
  href: string;
  external?: boolean;
  current?: boolean;
  className?: string;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ children, href, current, external, ...rest }, ref) =>
    external ? (
      <a {...rest} ref={ref} href={href} rel="noreferrer noopener" target="_blank">
        {children}
      </a>
    ) : (
      <NextLink href={href}>
        <a {...rest} ref={ref} aria-current={current ? 'page' : 'false'}>
          {children}
        </a>
      </NextLink>
    ),
);
