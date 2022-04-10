<template>
  <div ref="features">
    <slot name="default">
      <vj-geometry-fill
        :color="fillColor"
        :outlineColor="outlineColor"
        :opacity="opacity"
        :antialias="antialias"
      >
        <slot name="popup" />
      </vj-geometry-fill>
    </slot>
  </div>
</template>

<script lang="ts">
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

import { Polygon } from "./classes/GeometryPolygon";
import { mountGeometry, updateGeometry } from "./Geometry";
import { filterObject } from "/@/lib/core/src/utils/vuehelper";
import VjGeometryFill from "./GeometryFill.vue";
let polygonsAdded = 0;

export default defineComponent({
  name: "VjGeometryPolygon",
  components: {
    VjGeometryFill
  },
  props: {
    id: {
      type: String,
      default: "polygon"
    },
    path: {
      type: Array as any as () => Array<[number, number]>,
      required: true
    },
    fillColor: {
      type: String
    },
    outlineColor: {
      type: String
    },
    opacity: {
      type: Number
    },
    antialias: {
      type: Boolean
    }
  },
  setup(props) {
    const vmap = inject("vmap", null) as Deferred<Map> | null;
    const vpolygon = new Deferred<Polygon>();
    const id = `${props.id}-${polygonsAdded++}`;

    const polygon = new Polygon(
      filterObject({ ...props, id }, [
        "id",
        "path",
        "fillColor",
        "outlineColor",
        "opacity",
        "antialias"
      ])
    );

    provide("vpolygon", vpolygon);

    onMounted(async () => {
      if (vmap) {
        await mountGeometry(vmap, polygon);
        vpolygon.resolve(polygon);
        polygon.deferred.resolve(polygon);
      }
    });

    watch(props, async () => {
      if (vmap) {
        polygon.updateOptions(props);
        await updateGeometry(props, vmap, polygon);
      }
    });

    onUnmounted(async () => {
      if (vmap) {
        const map = await vmap.promise;
        map.removeLayer(polygon.id);
      }
    });
  }
});
</script>
