import { inject } from "vue";
import { Map } from "vjmap";
import Deferred from "/@/lib/core/src/utils/deferred";

export default {
  setup() {
    const vmap = inject("vmap", null) as Deferred<Map> | null;

    return { vmap };
  }
};
