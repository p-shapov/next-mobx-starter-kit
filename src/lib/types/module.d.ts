declare module 'typedi/token.class' {
  class Token<T> {
    name?: string;
    _tag: T;
    /**
     * @param name Token name, optional and only used for debugging purposes.
     */
    constructor(name?: string);
  }
}
