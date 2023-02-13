export const parseTime = (ms: number) => {
  const time = ms / 1000;

  const days = Math.floor(time / (60 * 60 * 24));
  const hours = Math.floor((time % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((time % (60 * 60)) / 60);
  const seconds = Math.floor(time % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
  };
};
