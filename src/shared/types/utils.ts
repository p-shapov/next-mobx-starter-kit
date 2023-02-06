export type Strict<T, X extends T> = T & { [K in keyof X]: K extends keyof T ? X[K] : never };

export type Entries<T> = Array<
  {
    [K in keyof T]: [K, T[K]];
  }[keyof T]
>;
