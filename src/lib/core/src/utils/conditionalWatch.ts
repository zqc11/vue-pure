export type ORef<T> = Ref<T | undefined> | undefined;
import {
  Ref,
  UnwrapRef,
  watch,
  WatchCallback,
  WatchOptions,
  WatchStopHandle
} from "vue";

export default <T, _U = T>(
  ref: ORef<T> | UnwrapRef<T> | T,
  cb: WatchCallback<T>,
  options?: WatchOptions
): WatchStopHandle | null => {
  if (ref && (ref as any).value !== undefined)
    return watch(ref as any, cb as WatchCallback, options);
  else return null;
};
