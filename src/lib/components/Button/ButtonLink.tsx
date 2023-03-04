import { Button as BaseButton } from 'reakit/Button';
import { forwardRef, type ReactElement, type MouseEventHandler } from 'react';
import classNames from 'classnames';

import { LinkItem } from 'lib/types/common';
import { Link } from 'lib/components';

import styles from './Button.module.scss';

export type ButtonLinkProps = LinkItem & {
  icon?: ReactElement;
  tabIndex?: number;
  stretch?: boolean;
  uppercase?: boolean;
  current?: boolean;
  disabled?: boolean;
  focusable?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ text, icon, stretch, uppercase, ...rest }, ref) => {
    return (
      <BaseButton
        {...rest}
        ref={ref}
        as={Link}
        className={classNames(styles['root'], {
          [styles['root--with-icon']]: !!icon,
          [styles['root--stretch']]: stretch,
          [styles['root--uppercase']]: uppercase,
        })}
      >
        <span className={styles['text']}>{text}</span>
        {icon && <span className={styles['icon']}>{icon}</span>}
      </BaseButton>
    );
  },
);
