import { Button as BaseButton } from 'ariakit/Button';
import { forwardRef, type MouseEventHandler, type ReactElement } from 'react';
import classNames from 'classnames';

import styles from './Button.module.scss';

type ButtonProps = {
  text: string;
  type?: 'button' | 'submit' | 'reset';
  tabIndex?: number;
  icon?: ReactElement;
  stretch?: boolean;
  uppercase?: boolean;
  loading?: boolean;
  disabled?: boolean;
  focusable?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ text, icon, stretch, uppercase, loading, ...rest }, ref) => {
    return (
      <BaseButton
        {...rest}
        ref={ref}
        className={classNames(styles['root'], {
          [styles['root--with-icon']]: !!icon,
          [styles['root--stretch']]: stretch,
          [styles['root--uppercase']]: uppercase,
          [styles['root--loading']]: loading,
        })}
      >
        {icon && <span className={styles['icon']}>{icon}</span>}
        <span className={styles['text']}>{text}</span>
      </BaseButton>
    );
  },
);

export { Button, type ButtonProps };
