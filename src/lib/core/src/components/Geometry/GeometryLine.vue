<template>
  <div />
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
import { GeometryLine } from "./classes/Geometry.Paint.Line";
import { filterObject } from "/@/lib/core/src/utils/vuehelper";

export default defineComponent({
  name: "VjGeometryLine",
  props: {
    blur: {
      type: Number
    },
    cap: {
      // eslint-disable-next-line no-undef
      type: String as () => CanvasLineCap
    },
    join: {
      // eslint-disable-next-line no-undef
      type: String as () => CanvasLineJoin
    },
    opacity: {
      type: Number,
      default: 1
    },
    color: {
      type: String,
      default: "#4668F2"
    },
    width: {
      type: Number
    },
    translate: {
      type: Array as any as () => [number, number]
    },
    offset: {
      type: Number
    },
    dasharray: {
      type: Array as () => number[]
    },
    gapWidth: {
      type: Number
    }
    // gradient: {
    //   type: String
    // },
    // miterLimit: {
    //   type: Number
    // },
    // roundLimit: {
    //   type: Number
    // },
    // sortKey: {
    //   type: Number
    // },
    // translateAnchor: {
    //   type: String as () => TranslateAnchor
    // }
  },
  setup(props) {
    const vGeometry = inject(
      "vGeometry",
      null
    ) as Deferred<GeometryType> | null;
    const vline = new Deferred<GeometryLine>();
    const vmap = inject("vmap", null) as Deferred<Map> | null;

    provide("vpaint", vline);

    if (!vGeometry)
      throw new Error("GeometryLine: no Geometry found as parent");

    const line = new GeometryLine({
      ...filterObject(props),
      Geometry: vGeometry
    });

    onMounted(async () => {
      if (vmap && vGeometry) {
        await line.init();
        const map = await vmap.promise;
        const Geometry = await vGeometry.promise;
        if (Geometry && map) {
          map.addLayer(line.getLayer());
          vline.resolve(line);
        }
      }
    });

    watch(props, async () => {
      const line = await vline.promise;
      if (line && vmap) line.update(props, vmap);
    });

    onUnmounted(async () => {
      if (vmap && line.id) {
        const map = await vmap.promise;
        map.removeLayer(line.id);
      }
    });

    return {};
  }
});
</script>
