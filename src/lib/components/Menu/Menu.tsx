import { forwardRef, type MouseEvent } from 'react';
import { Menu as BaseMenu, MenuButton as BaseMenuButton, MenuItem, useMenuState } from 'ariakit/Menu';

import { Button, ButtonLink, type ButtonProps, type ButtonLinkProps } from 'lib/components';

import styles from './Menu.module.scss';

type ButtonItem = Omit<ButtonProps, 'focusable' | 'type' | 'uppercase' | 'stretch' | 'icon'>;
type ButtonLinkItem = Omit<ButtonLinkProps, 'icon' | 'focusable' | 'uppercase' | 'stretch'>;

type MenuProps = Omit<ButtonProps, 'onClick'> & {
  text: string;
  label?: string;
  title?: string;
  items: Array<ButtonItem | ButtonLinkItem>;
};

const Menu = forwardRef<HTMLButtonElement, MenuProps>(({ title, label, items, ...rest }, ref) => {
  const menu = useMenuState({
    placement: 'bottom-end',
    animated: 500,
    gutter: 14,
  });

  return (
    <div className={styles['root']}>
      <BaseMenuButton {...rest} ref={ref} state={menu} as={Button} aria-label={label} />

      <BaseMenu state={menu} className={styles['dialog']} aria-label={title}>
        <div className={styles['content']}>
          {items.map((item, idx) =>
            'href' in item ? (
              <MenuItem
                {...item}
                state={menu}
                key={idx}
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
                state={menu}
                key={idx}
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

export { Menu };
