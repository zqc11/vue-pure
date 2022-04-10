export default class Deferred<T> {
  promise: Promise<T>;
  private fate;
  private state;
  private _val;
  private _resolve: any;
  private _reject: any;
  constructor(defaultVal?: T | null) {
    this.state = "pending";
    this.fate = "unresolved";
    this._val = defaultVal || null;
    this.promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
    this.promise.then(
      (val: T) => {
        this.state = "fulfilled";
        this._val = val;
      },
      () => {
        this.state = "rejected";
        this._val = null;
      }
    );
  }
  resolve(value?: any): void {
    if (this.fate === "resolved") {
      throw "Deferred cannot be resolved twice";
    }
    this.fate = "resolved";
    this._resolve(value);
  }
  reject(reason?: any): void {
    if (this.fate === "resolved") {
      throw "Deferred cannot be resolved twice";
    }
    this.fate = "resolved";
    this._reject(reason);
  }
  isResolved() {
    return this.fate === "resolved";
  }
  isPending() {
    return this.state === "pending";
  }
  isFulfilled() {
    return this.state === "fulfilled";
  }
  isRejected() {
    return this.state === "rejected";
  }
  get val() {
    return this._val;
  }
}
