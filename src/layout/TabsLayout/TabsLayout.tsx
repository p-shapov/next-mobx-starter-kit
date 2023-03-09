import { useRouter } from 'next/router';
import { FC, ReactElement, useEffect } from 'react';
import { Tab, TabList, useTabState, Button, TabPanel } from 'ariakit';

import { Badge, BadgeProps } from 'lib/components/Badge';

import styles from './TabsLayout.module.scss';

type TabsLayoutProps = {
  items: Array<{
    title: string;
    href: string;
    content: ReactElement;
    badge?: BadgeProps;
  }>;
};

export const TabsLayout: FC<TabsLayoutProps> = ({ items }) => {
  const router = useRouter();
  const tabListState = useTabState({ orientation: 'vertical', defaultSelectedId: router.pathname });

  useEffect(() => {
    for (const item of items) {
      if (item.href !== router.pathname) router.prefetch(item.href);
    }
  }, [items, router]);

  const mkHandleTabItemClick = (href: string) => () => {
    router.replace(href, undefined, { shallow: true });
  };

  return (
    <div className={styles['root']}>
      <TabList className={styles['tabList']} state={tabListState}>
        {items.map(
          ({
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            content: _,
            title,
            badge,
            ...item
          }) => (
            <Tab
              as={Button}
              key={item.href}
              id={item.href}
              className={styles['tabItem']}
              onClick={mkHandleTabItemClick(item.href)}
            >
              {title}
              {badge && (
                <span className={styles['tabBadge']}>
                  <Badge text={badge.text} color={badge.color} />
                </span>
              )}
            </Tab>
          ),
        )}
      </TabList>

      <div className={styles['tabPanel']}>
        {items.map(({ href, content }) => (
          <TabPanel key={href} id={href} state={tabListState}>
            {content}
          </TabPanel>
        ))}
      </div>
    </div>
  );
};
