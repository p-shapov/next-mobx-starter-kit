import { forwardRef, MouseEventHandler, type MouseEvent } from 'react';
import { Menu as BaseMenu, MenuButton as BaseMenuButton, MenuItem, useMenuState } from 'ariakit';

import { Button, ButtonLink, type ButtonProps, type ButtonLinkProps } from 'lib/components';

import styles from './Menu.module.scss';

type ButtonItem = Omit<ButtonProps, 'focusable' | 'type' | 'uppercase' | 'stretch' | 'icon'>;
type ButtonLinkItem = Omit<ButtonLinkProps, 'icon' | 'focusable' | 'uppercase' | 'stretch'>;

type MenuProps = Omit<ButtonProps, 'onClick'> & {
  text: string;
  label?: string;
  items: Array<ButtonItem | ButtonLinkItem>;
};

const Menu = forwardRef<HTMLButtonElement, MenuProps>(({ label, items, ...rest }, ref) => {
  const menu = useMenuState({
    placement: 'bottom-end',
    animated: 500,
    gutter: 14,
    focusLoop: true,
  });

  const mkHandleClickMenuItem =
    <T extends HTMLAnchorElement & HTMLButtonElement>(
      item: MenuProps['items'][number],
    ): MouseEventHandler<T> =>
    (e: MouseEvent<T>) => {
      item.onClick?.(e);
      menu.hide();
    };

  return (
    <div className={styles['root']}>
      <BaseMenuButton {...rest} ref={ref} state={menu} as={Button} aria-label={label} />

      <BaseMenu state={menu} className={styles['dialog']}>
        <div className={styles['content']}>
          {items.map((item, idx) =>
            'href' in item ? (
              <MenuItem
                {...item}
                state={menu}
                key={idx}
                as={ButtonLink}
                stretch
                uppercase
                onClick={mkHandleClickMenuItem(item)}
              />
            ) : (
              <MenuItem
                {...item}
                state={menu}
                key={idx}
                as={Button}
                stretch
                uppercase
                onClick={mkHandleClickMenuItem(item)}
              />
            ),
          )}
        </div>
      </BaseMenu>
    </div>
  );
});

export { Menu };
