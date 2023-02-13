export const getRestTime = (starts: number, ms: number) => starts - Math.floor(Date.now()) + ms;
