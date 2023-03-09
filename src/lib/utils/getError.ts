export const getError = (error: unknown) => {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'string') {
    return new Error('Unknown error', { cause: error });
  }

  return new Error('Unknown error');
};
