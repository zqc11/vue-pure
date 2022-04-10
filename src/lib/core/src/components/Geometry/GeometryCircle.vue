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

import { Circle } from "./classes/GeometryCircle";
import { mountGeometry, updateGeometry } from "./Geometry";
import { filterObject } from "/@/lib/core/src/utils/vuehelper";
import VjGeometryFill from "./GeometryFill.vue";
let circlesAdded = 0;

export default defineComponent({
  name: "VjGeometryCircle",
  components: {
    VjGeometryFill
  },
  props: {
    id: {
      type: String,
      default: "circle"
    },
    center: {
      type: Array as any as () => [number, number],
      required: true
    },
    radius: {
      type: Number,
      required: true
    },
    edges: {
      type: Number,
      default: 60
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
    const vcircle = new Deferred<Circle>();
    const id = `${props.id}-${circlesAdded++}`;

    const circle = new Circle(
      filterObject({ ...props, id }, [
        "id",
        "radius",
        "center",
        "edges",
        "fillColor",
        "outlineColor",
        "opacity",
        "antialias"
      ])
    );

    provide("vcircle", vcircle);

    onMounted(async () => {
      if (vmap) {
        await mountGeometry(vmap, circle);
        vcircle.resolve(circle);
        circle.deferred.resolve(circle);
      }
    });

    watch(props, async () => {
      if (vmap) {
        await updateGeometry(props, vmap, circle);
      }
    });

    onUnmounted(async () => {
      if (vmap) {
        const map = await vmap.promise;
        map.removeLayer(circle.id);
      }
    });
  }
});
</script>
