<template>
  <div :style="style" ref="root" class="vj-map">
    <div ref="mapContainer" class="map-container" :style="{ height, width }">
      <div v-if="mapStatus && mapStatus !== 'loading'">
        <slot name="error">
          <div :style="style">
            <h1 style="color: #ff0000; line-height: 40px">
              Error:{{ mapStatus }}
            </h1>
          </div>
        </slot>
      </div>
      <div v-else>
        <slot />
      </div>
    </div>
    <div v-if="mapStatus === 'loading'" class="loading">
      <slot name="loader">
        <div :style="style">
          <div class="loadEffect">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  provide,
  ref,
  watch,
  UnwrapRef,
  Ref
} from "vue";
import vjmap, {
  Map,
  FlyToOptions,
  GeoBounds,
  IOpenMapParam,
  LngLatBounds,
  LngLatLike
} from "vjmap";
import "vjmap/dist/vjmap.min.css";
import Deferred from "/@/lib/core/src/utils/deferred";
import {
  registerMapEvents,
  getDivStyle,
  mountMap,
  MapEmits,
  updateStyle,
  mapWatcher,
  watchMapOpenStatus
} from "./Map";
import vmodel from "/@/lib/core/src/utils/vmodel";

export default defineComponent({
  name: "VjMap",
  emits: MapEmits,
  props: {
    serviceUrl: {
      type: String,
      required: true
    },
    accessToken: {
      type: String,
      required: true
    },
    openMapParam: {
      type: Object as () => IOpenMapParam
    },
    mapBounds: {
      type: ([Object, null] as any as () => GeoBounds) || null,
      default: null
    },
    height: {
      type: String,
      default: "100%"
    },
    width: {
      type: String,
      default: "100%"
    },
    container: {
      type: ([Object, String] as any as () => HTMLElement) || String,
      default: ""
    },
    minZoom: {
      type: Number,
      default: 0
    },
    maxZoom: {
      type: Number,
      default: 22
    },
    minPitch: {
      type: Number,
      default: 0
    },
    maxPitch: {
      type: Number,
      default: 85
    },
    mapStyle: {
      type: [Object, String] as any as () => Record<string, any> | string,
      default: ""
    },
    hash: {
      type: Boolean,
      default: false
    },
    interactive: {
      type: Boolean,
      default: true
    },
    bearingSnap: {
      type: Number,
      default: 7
    },
    pitchWithRotate: {
      type: Boolean,
      default: true
    },
    clickTolerance: {
      type: Number,
      default: 3
    },
    attributionControl: {
      type: Boolean,
      default: false
    },
    customAttribution: {
      type: Array as () => string | Array<any> | null,
      default: null
    },
    logoPosition: {
      type: String,
      default: "bottom-left"
    },
    failIfMajorPerformanceCaveat: {
      type: Boolean,
      default: false
    },
    preserveDrawingBuffer: {
      type: Boolean,
      default: false
    },
    antialias: {
      type: Boolean,
      default: true
    },
    refreshExpiredTiles: {
      type: Boolean,
      default: true
    },
    maxBounds: {
      type: [Array, Object] as any as () => LngLatLike | null,
      default: null
    },
    scrollZoom: {
      type: [Boolean, Object],
      default: true
    },
    boxZoom: {
      type: Boolean,
      default: true
    },
    dragRotate: {
      type: Boolean,
      default: true
    },
    dragPan: {
      type: [Object, Boolean] as any as () => boolean | Record<string, any>,
      default: true
    },
    keyboard: {
      type: Boolean,
      default: true
    },
    doubleClickZoom: {
      type: Boolean,
      default: true
    },
    touchZoomRotate: {
      type: [Boolean, Object] as any as () => boolean | Record<string, any>,
      default: true
    },
    trackResize: {
      type: Boolean,
      default: true
    },
    center: {
      default: () => [0, 0] as [number, number]
    },
    zoom: {
      type: Number,
      default: 0
    },
    bearing: {
      type: Number,
      default: 0
    },
    useInitView: {
      type: Boolean,
      default: true
    },
    pitch: {
      type: Number,
      default: 0
    },
    bounds: {
      type: Array as any as () => LngLatBounds | Array<number>
    },
    fitBoundsOptions: {
      type: Object
    },
    renderWorldCopies: {
      type: Boolean,
      default: false
    },
    maxTileCacheSize: {
      type: Number,
      default: null
    },
    localIdeographFontFamily: {
      type: String,
      default: "sans-serif"
    },
    transformRequest: {
      type: Function,
      default: null
    },
    collectResourceTiming: {
      type: Boolean,
      default: false
    },
    fadeDuration: {
      type: Number,
      default: 300
    },
    crossSourceCollisions: {
      type: Boolean,
      default: true
    },
    zoomLogo: {
      type: Number,
      default: 1
    },
    flyToOptions: {
      default: () => ({} as FlyToOptions)
    },
    autoResize: {
      type: Boolean,
      default: false
    },
    autoResizeDelay: {
      type: Number,
      default: 0
    },
    isVectorStyle: {
      type: Boolean,
      default: false
    }
  },
  setup: props => {
    const root: Ref<null | HTMLElement> = ref(null);
    const mapContainer: Ref<null | HTMLElement> = ref(null);
    const svc = new vjmap.Service(props.serviceUrl, props.accessToken);
    const mapStatus = ref("loading");
    const vmap = new Deferred<Map>();
    provide("vmap", vmap);

    const i_center = vmodel<LngLatLike, UnwrapRef<LngLatLike>>(
      props,
      "update:center",
      "center"
    );
    const i_flyToOptions = vmodel<FlyToOptions, UnwrapRef<FlyToOptions>>(
      props,
      "update:flyToOptions",
      "flyToOptions"
    );

    const style = ref(getDivStyle(props));

    watch(props, async p => {
      updateStyle(p, style);
    });

    mapWatcher(vmap, props, { center: i_center, flyToOptions: i_flyToOptions });

    onMounted(async () => {
      try {
        const instance = getCurrentInstance();
        let err = await mountMap(svc, props as any, vmap, mapContainer, root);
        const map = await vmap.promise;
        if (err) {
          mapStatus.value = map.getError();
        } else {
          mapStatus.value = "";
        }
        // 切换图形时需监听
        watchMapOpenStatus(map, mapStatus);
        if (instance && !err) {
          await registerMapEvents(vmap, instance);
        }
      } catch (e: any) {
        mapStatus.value =
          e.message || e.response || JSON.stringify(e).substring(0, 80);
      }
    });

    onUnmounted(async () => {
      const map = await vmap.promise;
      map.remove();
    });

    return {
      svc,
      vmap,
      root,
      style,
      i_center,
      i_flyToOptions,
      mapContainer,
      mapStatus
    };
  }
});
</script>

<style scoped>
.loading {
  position: absolute;
  z-index: 1;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
}

.loadEffect {
  width: 100px;
  height: 100px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}

.loadEffect span {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: lightgreen;
  position: absolute;
  -webkit-animation: load 1.04s ease infinite;
}
@-webkit-keyframes load {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0.2;
  }
}

.loadEffect span:nth-child(1) {
  left: 0;
  top: 50%;
  margin-top: -8px;
  -webkit-animation-delay: 0.13s;
}

.loadEffect span:nth-child(2) {
  left: 14px;
  top: 14px;
  -webkit-animation-delay: 0.26s;
}

.loadEffect span:nth-child(3) {
  left: 50%;
  top: 0;
  margin-left: -8px;
  -webkit-animation-delay: 0.39s;
}

.loadEffect span:nth-child(4) {
  top: 14px;
  right: 14px;
  -webkit-animation-delay: 0.52s;
}

.loadEffect span:nth-child(5) {
  right: 0;
  top: 50%;
  margin-top: -8px;
  -webkit-animation-delay: 0.65s;
}

.loadEffect span:nth-child(6) {
  right: 14px;
  bottom: 14px;
  -webkit-animation-delay: 0.78s;
}

.loadEffect span:nth-child(7) {
  bottom: 0;
  left: 50%;
  margin-left: -8px;
  -webkit-animation-delay: 0.91s;
}

.loadEffect span:nth-child(8) {
  bottom: 14px;
  left: 14px;
  -webkit-animation-delay: 1.04s;
}
</style>
