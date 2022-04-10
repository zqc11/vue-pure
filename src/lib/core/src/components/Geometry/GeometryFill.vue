<template>
  <div>
    <slot />
  </div>
</template>

<script lang="ts">
import { GeometryType } from "./classes/Geometry";
import {
  defineComponent,
  inject,
  onMounted,
  onUnmounted,
  provide,
  watch
} from "vue";
import { Map } from "vjmap";
import Deferred from "/@/lib/core/src/utils/deferred";
import { GeometryFill } from "./classes/Geometry.Paint.Fill";
import { filterObject } from "/@/lib/core/src/utils/vuehelper";

export default defineComponent({
  name: "VjGeometryFill",
  props: {
    color: {
      type: String,
      default: "#4668F2"
    },
    antialias: {
      type: Boolean,
      default: true
    },
    opacity: {
      type: Number,
      default: 0.6
    },
    outlineColor: {
      type: String
    }
  },
  setup(props) {
    const vGeometry = inject(
      "vGeometry",
      null
    ) as Deferred<GeometryType> | null;
    const vfill = new Deferred<GeometryFill>();
    const vmap = inject("vmap", null) as Deferred<Map> | null;

    if (!vGeometry)
      throw new Error("GeometryFill: no Geometry found as parent");

    const fill = new GeometryFill({
      ...filterObject(props),
      Geometry: vGeometry
    });
    provide("vfill", vfill);

    onMounted(async () => {
      if (vmap && vGeometry) {
        const map = await vmap.promise;
        const Geometry = await vGeometry.promise;
        if (Geometry && map) {
          await fill.init();
          map.addLayer(fill.getLayer());
          vfill.resolve(fill);
          fill.deferred.resolve(fill);
        }
      }
    });

    watch(props, async () => {
      const fill = await vfill.promise;
      if (fill && vmap) fill.update(props, vmap);
    });

    onUnmounted(async () => {
      if (vmap && fill.id) {
        const map = await vmap.promise;
        map.removeLayer(fill.id);
      }
    });

    return {};
  }
});
</script>
