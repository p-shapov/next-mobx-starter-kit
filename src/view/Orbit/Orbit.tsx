import { FC } from 'react';
import classNames from 'classnames';
import NextImage from 'next/image';

import { ReactComponent as RocketFlame_SVG } from 'public/icons/rocket_flame.svg';
import { ReactComponent as Chart_SVG } from 'public/icons/chart.svg';
import spaceship_png from 'public/images/spaceship.png';

import styles from './Orbit.module.scss';

type OrbitProps = {
  connected?: boolean;
};

const Orbit: FC<OrbitProps> = ({ connected }) => {
  return (
    <>
      <div
        className={classNames(styles['chart'], {
          [styles['chart--to-the-moon']]: connected,
        })}
      >
        <Chart_SVG />
      </div>

      <div className={styles['orbit']}>
        <div
          className={classNames(styles['planet'], {
            [styles['planet--moving-away']]: connected,
          })}
        />

        <div
          className={classNames(styles['spaceship'], {
            [styles['spaceship--to-the-moon']]: connected,
            [styles['spaceship--drifting']]: !connected,
          })}
        >
          <NextImage src={spaceship_png} alt="spaceship" width={277} height={277} priority quality={100} />

          <div
            className={classNames(styles['rocket-flame'], {
              [styles['rocket-flame--launch']]: connected,
            })}
          >
            <RocketFlame_SVG />
          </div>
        </div>
      </div>
    </>
  );
};

export { Orbit };
