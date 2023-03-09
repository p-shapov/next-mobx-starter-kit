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

  useEffect(() => {
    if (tabListState.activeId && tabListState.activeId !== router.pathname) {
      router.replace(tabListState.activeId, undefined, { shallow: true });
    }
  }, [router, tabListState.activeId]);

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
            <span key={item.href} className={styles['tabItem']}>
              <Tab as={Button} id={item.href} aria-describedby={`${item.href}-badge`}>
                {title}
              </Tab>
              {badge && (
                <span id={`${item.href}-badge`} className={styles['tabBadge']}>
                  <Badge text={badge.text} color={badge.color} />
                </span>
              )}
            </span>
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
