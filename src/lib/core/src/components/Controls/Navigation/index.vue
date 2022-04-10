<template>
  <div />
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, onUnmounted } from "vue";
import { Map, NavigationControl } from "vjmap";
import {
  getNavigationControlOptions,
  mountNavigationControl
} from "./Navigation";
import Deferred from "/@/lib/core/src/utils/deferred";
import { NavigationControlPosition } from "./types";

export default defineComponent({
  name: "VjNavigationControl",
  props: {
    showCompass: {
      type: Boolean,
      default: true
    },
    showZoom: {
      type: Boolean,
      default: true
    },
    visualizePitch: {
      type: Boolean,
      default: true
    },
    position: {
      type: String as () => NavigationControlPosition,
      default: () => "top-right"
    }
  },
  setup(props) {
    const vmap = inject("vmap", null) as Deferred<Map> | null;
    const navOptions = getNavigationControlOptions(props);
    const vnavigationControl = new NavigationControl(navOptions);

    onMounted(() => {
      if (vmap)
        mountNavigationControl(vnavigationControl, vmap, props.position);
    });

    onUnmounted(async () => {
      if (vmap) {
        const map = await vmap.promise;
        map.removeControl(vnavigationControl);
      }
    });
  }
});
</script>
