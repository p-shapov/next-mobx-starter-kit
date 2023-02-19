import { forwardRef, useId, type MouseEvent } from 'react';
import { Menu as BaseMenu, MenuButton as BaseMenuButton, MenuItem, useMenuState } from 'reakit/Menu';

import { Button, ButtonLink, type ButtonProps, type ButtonLinkProps } from 'lib/components';

import styles from './Menu.module.scss';

export type MenuProps = Omit<ButtonProps, 'onClick'> & {
  text: string;
  label?: string;
  title?: string;
  items: Array<ButtonProps | ButtonLinkProps>;
};

export const Menu = forwardRef<HTMLButtonElement, MenuProps>(({ title, label, items, ...rest }, ref) => {
  const baseId = useId();
  const menu = useMenuState({
    baseId,
    placement: 'bottom-end',
    animated: 500,
    gutter: 14,
    loop: true,
  });

  return (
    <div className={styles['root']}>
      <BaseMenuButton {...rest} {...menu} ref={ref} as={Button} aria-label={label} />

      <BaseMenu {...menu} className={styles['dialog']} aria-label={title}>
        <div className={styles['content']}>
          {items.map((item, idx) =>
            'href' in item ? (
              <MenuItem
                {...item}
                {...menu}
                key={`${baseId}-${idx}`}
                as={ButtonLink}
                onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                  item.onClick?.(e);
                  menu.hide();
                }}
                aria-label={title}
                stretch
                uppercase
              />
            ) : (
              <MenuItem
                {...item}
                {...menu}
                key={`${baseId}-${idx}`}
                as={Button}
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  item.onClick?.(e);
                  menu.hide();
                }}
                aria-label={title}
                stretch
                uppercase
              />
            ),
          )}
        </div>
      </BaseMenu>
    </div>
  );
});
