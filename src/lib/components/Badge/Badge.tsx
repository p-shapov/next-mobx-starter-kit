import classNames from 'classnames';
import { FC } from 'react';

import styles from './Badge.module.scss';

type BadgeProps = {
  text: string;
  color?: 'green' | 'violet';
};

const Badge: FC<BadgeProps> = ({ text, color = 'violet' }) => {
  return <span className={classNames(styles['root'], styles[`root--color_${color}`])}>{text}</span>;
};

export { Badge, type BadgeProps };
