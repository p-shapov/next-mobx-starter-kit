// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class AbstractFactory<T extends Array<any>, K> {
  abstract create(...params: T): K;
}
