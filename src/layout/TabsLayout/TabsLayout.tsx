import { useRouter } from 'next/router';
import { FC } from 'react';

import { Link } from 'lib/components';
import { LinkItem } from 'lib/types/common';

type TabsLayoutProps = {
  links: Array<Omit<LinkItem, 'external'>>;
};

export const TabsLayout: FC<TabsLayoutProps> = ({ links }) => {
  const router = useRouter();

  return (
    <div>
      <nav>
        <ul>
          {links.map((link, idx) => (
            <li key={idx}>
              <Link {...{ ...link, current: router.pathname === link.href }}>{link.text}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
