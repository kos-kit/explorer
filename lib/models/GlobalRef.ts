type NonUndefined<T> = T extends undefined ? never : T;

// https://github.com/vercel/next.js/discussions/15054
export class GlobalRef<T> {
  private readonly sym: symbol;

  constructor(uniqueName: string) {
    this.sym = Symbol.for(uniqueName);
  }

  get value(): T | undefined {
    return (global as any)[this.sym] as NonUndefined<T> | undefined;
  }

  set value(value: NonUndefined<T>) {
    (global as any)[this.sym] = value;
  }
}
