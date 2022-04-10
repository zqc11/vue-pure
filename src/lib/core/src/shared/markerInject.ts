import { inject } from "vue";
import { Marker } from "vjmap";
import Deferred from "/@/lib/core/src/utils/deferred";

export default {
  setup() {
    const vmarker = inject("vmarker") as Deferred<Marker>;

    return { vmarker };
  }
};
