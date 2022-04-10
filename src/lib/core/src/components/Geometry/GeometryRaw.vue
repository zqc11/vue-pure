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
import { mountGeometry, updateGeometry } from "./Geometry";
import { filterObject } from "/@/lib/core/src/utils/vuehelper";
import { GeoJSONSource, Map } from "vjmap";
import Deferred from "/@/lib/core/src/utils/deferred";
import {
  defineComponent,
  inject,
  onMounted,
  onUnmounted,
  provide,
  watch
} from "vue";
import { GeometryRaw } from "./classes/GeometryRaw";
import { Feature, FeatureCollection } from "geojson";
import VjGeometryFill from "./GeometryFill.vue";
let rawDataAdded = 0;

export default defineComponent({
  name: "VjGeometryRaw",
  components: {
    VjGeometryFill
  },
  props: {
    source: {
      type: Object as () => GeoJSONSource | FeatureCollection | Feature,
      required: true
    },
    id: {
      type: String,
      default: "raw"
    },
    fillColor: {
      type: String,
      default: "red"
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
    const vraw = new Deferred<GeometryRaw>();
    const id = `${props.id}-${rawDataAdded++}`;

    const raw = new GeometryRaw(
      filterObject({ ...props, id }, [
        "source",
        "id",
        "fillColor",
        "outlineColor",
        "opacity",
        "antialias"
      ])
    );

    provide("vraw", vraw);

    onMounted(async () => {
      if (vmap) {
        await mountGeometry(vmap, raw);
        vraw.resolve(raw);
        raw.deferred.resolve(raw);
      }
    });

    watch(props, async () => {
      if (vmap) {
        raw.updateOptions(props);
        await updateGeometry(props, vmap, raw);
      }
    });

    onUnmounted(async () => {
      if (vmap) {
        const map = await vmap.promise;
        map.removeLayer(raw.id);
      }
    });
  }
});
</script>
