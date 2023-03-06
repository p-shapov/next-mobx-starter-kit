import { FC } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import classNames from 'classnames';
import NextImage from 'next/image';
import { observer } from 'mobx-react-lite';

import { ReactComponent as RocketFlame_SVG } from 'public/icons/rocket_flame.svg';
import { ReactComponent as Chart_SVG } from 'public/icons/chart.svg';
import spaceship_png from 'public/images/spaceship.png';

import { ClientOnly } from 'lib/components';

import type { MappedDatapoint } from 'service/Datapoint/types';

import styles from './Orbit.module.scss';

type OrbitProps = {
  connected: MappedDatapoint<boolean>;
};

const Orbit: FC<OrbitProps> = observer(({ connected }) => {
  return (
    <>
      <ClientOnly>
        <AnimatePresence mode="popLayout">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {connected.data.value && (
              <div className={styles['chart']}>
                <Chart_SVG />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </ClientOnly>

      <div className={styles['orbit']}>
        <AnimatePresence mode="popLayout">
          <motion.div
            className={styles['planet']}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>

        <ClientOnly>
          <motion.div
            className={classNames(styles['spaceship'], {
              [styles['spaceship--to-the-moon']]: !!connected.data.value,
              [styles['spaceship--to-the-orbit']]: !connected.data.value,
            })}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <NextImage src={spaceship_png} alt="spaceship" width={277} height={277} priority quality={100} />

            {connected.data.value && (
              <div className={styles['rocket-flame']}>
                <RocketFlame_SVG />
              </div>
            )}
          </motion.div>
        </ClientOnly>
      </div>
    </>
  );
});

export { Orbit };
