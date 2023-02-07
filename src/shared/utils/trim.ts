export const trim = (str: string, takeFromStart: number, takeFromEnd: number) =>
  `${str.substring(0, takeFromStart)}…${str.substring(str.length - takeFromEnd)}`;
