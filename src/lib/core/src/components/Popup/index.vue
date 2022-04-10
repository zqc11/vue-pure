<template>
  <div ref="content">
    <slot />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  inject,
  onMounted,
  onUnmounted,
  Ref,
  ref,
  watch
} from "vue";
import { Marker, Anchor, Map, Popup, Offset } from "vjmap";
import {
  getPopupOptions,
  mountPopup,
  PopupEmits,
  registerPopupEvents,
  updatePopup
} from "./Popup";
import Deferred from "/@/lib/core/src/utils/deferred";
import { LngLatInput } from "/@/lib/core/src/utils/types";
import { GeometryPaintType } from "../Geometry/classes/Geometry.Paint";

export default defineComponent({
  name: "Popup",
  emits: PopupEmits,
  props: {
    lngLat: {
      default: () => [0, 0] as LngLatInput
    },
    closeButton: {
      type: Boolean,
      default: false
    },
    closeOnClick: {
      type: Boolean,
      default: true
    },
    closeOnMove: {
      type: Boolean,
      default: false
    },
    anchor: {
      type: String as () => Anchor,
      default: undefined
    },
    offset: {
      type: Number as () => Offset,
      default: undefined
    },
    className: {
      type: String
    },
    maxWidth: {
      type: String,
      default: "500px"
    },
    renderless: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const content = ref(null) as Ref<any>;

    const vmap = inject("vmap", null) as Deferred<Map> | null;
    const vmarker: Deferred<Marker> | null = inject("vmarker", null);
    const vpaint = inject(
      "vgeogeometry_paint",
      null
    ) as Deferred<GeometryPaintType> | null;

    const popupOptions = getPopupOptions(props);
    const vpopup = new Popup(popupOptions).setLngLat(props.lngLat as any);

    onMounted(async () => {
      const instance = getCurrentInstance();
      if (vmap && instance) {
        await mountPopup(instance, vmap, vpopup, vmarker, vpaint, content);
        registerPopupEvents(vpopup, instance);
      }
    });

    watch(props, props => {
      updatePopup(props, vpopup);
    });

    onUnmounted(async () => {
      vpopup.remove();
    });

    return { content };
  }
});
</script>
