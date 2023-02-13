import { SyntheticEvent } from 'react';

export const withPreventDefault = (fn: () => unknown) => (e: SyntheticEvent | Event) => {
  e.preventDefault();
  fn();
};
