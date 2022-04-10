import vjmap, {
  MapOptions,
  Map,
  Service,
  GeoBounds,
  Projection,
  GeoProjection
} from "vjmap";
import Deferred from "/@/lib/core/src/utils/deferred";
import { Ref, toRaw, toRef, toRefs, watch } from "vue";
import { ComponentInternalInstance } from "vue";

import {
  DivStyle,
  MapInput,
  positionProps,
  positionPropsUnwrapped,
  reactiveProps,
  regularProps
} from "./types";
import { duplicateEvents, filterObject } from "/@/lib/core/src/utils/vuehelper";
import conditionalWatch from "/@/lib/core/src/utils/conditionalWatch";
import { enableAutoResize, enableTouchZoomRotate } from "./MapResize";

export const getDivStyle = (props: any): DivStyle => ({
  height: props.height,
  width: props.width,
  "--zoom-logo": props.zoomLogo >= 0.8 ? props.zoomLogo : 1
});

export const getMapOptions = (props: MapInput, el: any): MapOptions => {
  const opts = filterObject(props, [
    "style",
    "antialias",
    "attributionControl",
    "bearing",
    "bearingSnap",
    "bounds",
    "boxZoom",
    "center",
    "clickTolerance",
    "collectResourceTiming",
    "container",
    "crossSourceCollisions",
    "customAttribution",
    "doubleClickZoom",
    "dragPan",
    "dragRotate",
    "fadeDuration",
    "failIfMajorPerformanceCaveat",
    "fitBoundsOptions",
    "hash",
    "interactive",
    "keyboard",
    "localIdeographFontFamily",
    "logoPosition",
    "maxBounds",
    "maxPitch",
    "maxTileCacheSize",
    "maxZoom",
    "minPitch",
    "minZoom",
    "pitch",
    "pitchWithRotate",
    "preserveDrawingBuffer",
    "refreshExpiredTiles",
    "renderWorldCopies",
    "scrollZoom",
    "touchZoomRotate",
    "trackResize",
    "transformRequest",
    "zoom"
  ]);
  opts.container = el;
  return opts;
};

export const mountMap = async (
  svc: Service,
  props: MapInput,
  vmap: Deferred<Map>,
  mapContainerRef: Ref<any>,
  rootContainerRef: Ref<any>
) => {
  let error;
  let prj!: GeoProjection;
  if (props.openMapParam && props.openMapParam.mapid) {
    // 打开地图
    const openParam = {
      mapid: props.openMapParam.mapid, // 地图ID
      mapopenway: props.openMapParam.mapopenway ?? vjmap.MapOpenWay.Memory,
      style:
        props.openMapParam.style !== undefined
          ? toRaw(props.openMapParam.style)
          : vjmap.openMapDarkStyle(), // div为深色背景颜色时，这里也传深色背景样式
      version:
        props.openMapParam.version !== undefined
          ? props.openMapParam.version
          : undefined
    };
    const res = await svc.openMap(openParam);
    if (res.error) {
      // 如果打开出错
      error = res.error;
    } else {
      // 获取地图的范围
      const mapExtent = vjmap.GeoBounds.fromString(res.bounds);
      prj = new vjmap.GeoProjection(mapExtent);
    }
  } else if (props.mapBounds) {
    prj = new vjmap.GeoProjection(props.mapBounds);
  }

  const element = mapContainerRef.value;
  // 缺省值设置
  const mapOptions = getMapOptions(props, element);
  if (error || !prj) {
    if (!prj) {
      prj = new vjmap.GeoProjection(
        GeoBounds.fromArray(Projection.EARTH_BOUNDS)
      );
    }
    mapOptions.style = svc.rasterBlankStyle(0, 24);
  } else if (!mapOptions.style) {
    if (props.openMapParam?.mapopenway === vjmap.MapOpenWay.Memory) {
      mapOptions.style = svc.rasterStyle();
    } else {
      mapOptions.style = props.isVectorStyle
        ? svc.vectorStyle()
        : svc.rasterStyle();
    }
  }
  const view = svc.currentMapParam()?.view; // 视图初始化
  if (view?.center && props.useInitView) {
    mapOptions.center = view?.center;
    mapOptions.zoom = view?.zoom ?? 0;
    mapOptions.bearing = view?.bearing ?? 0;
  }
  //

  const map = new vjmap.Map(mapOptions);
  if (error) {
    map.setError(error);
  }
  // 地图关联服务对象和坐标系
  map.attach(svc, prj);
  await map.onLoad();
  if (vmap.isPending()) {
    vmap.resolve(map);
  }

  if (props.autoResize) {
    enableAutoResize(rootContainerRef, map, props.autoResizeDelay);
  }

  if (props.touchZoomRotate) {
    enableTouchZoomRotate(map, toRef(props, "touchZoomRotate"));
  }
  return error;
};

export const coordsChanged = (
  newCoords: [number, number],
  oldCorrds: [number, number]
) => newCoords[0] !== oldCorrds[0] || newCoords[1] !== newCoords[1];

export const updateStyle = (props: any, style: Ref<DivStyle>): void => {
  style.value = getDivStyle(props);
};

export async function mapWatcher(
  vmap: Deferred<Map>,
  props: Record<string, any>,
  propsReactive: reactiveProps
) {
  const {
    width,
    height,
    bearing,
    maxBounds,
    maxPitch,
    minZoom,
    maxZoom,
    minPitch,
    pitch,
    renderWorldCopies,
    zoom
  } = toRefs(props);

  const { center, flyToOptions } = propsReactive;

  await watchDimensions(vmap, width, height);
  await watchRegular(vmap, {
    bearing,
    maxBounds,
    maxPitch,
    minPitch,
    pitch,
    renderWorldCopies
  });
  await watchPosition(vmap, { maxZoom, center, flyToOptions, minZoom, zoom });
}

export async function watchDimensions(
  vmap: Deferred<Map>,
  width: Ref<string>,
  height: Ref<string>
) {
  const map = await vmap.promise;
  watch(width, () => map.resize());
  watch(height, () => map.resize());
}

export async function watchRegular(vmap: Deferred<Map>, refs: regularProps) {
  const map = await vmap.promise;
  conditionalWatch(refs.bearing, val => map.setBearing(val));
  conditionalWatch(refs.maxBounds, val => map.setMaxBounds(val));
  conditionalWatch(refs.maxPitch, val => map.setMaxPitch(val));
  conditionalWatch(refs.minPitch, val => map.setMinPitch(val));
  conditionalWatch(refs.pitch, val => map.setPitch(val));
  conditionalWatch(refs.renderWorldCopies, val =>
    map.setRenderWorldCopies(val)
  );
}

export function watchPosition(vmap: Deferred<Map>, refs: positionProps) {
  conditionalWatch(
    refs.center as any as [number, number],
    center => updateMapPosition(vmap, { center }),
    { deep: true }
  );
  conditionalWatch(
    refs.flyToOptions,
    flyToOptions => updateMapPosition(vmap, { flyToOptions }),
    { deep: true }
  );
  conditionalWatch(refs.maxZoom, maxZoom =>
    updateMapPosition(vmap, { maxZoom })
  );
  conditionalWatch(refs.minZoom, minZoom =>
    updateMapPosition(vmap, { minZoom })
  );
  conditionalWatch(refs.zoom, zoom => updateMapPosition(vmap, { zoom }));
}

export function watchMapOpenStatus(map: Map, status: Ref<string>) {
  map.on("maperror", () => {
    status.value = map.getError();
  });
  map.on("mapopenstart", () => {
    status.value = "loading";
  });
  map.on("mapopenfinish", () => {
    status.value = "";
  });
}

export async function updateMapPosition(
  vmap: Deferred<Map>,
  posProps: positionPropsUnwrapped
) {
  const map = await vmap.promise;
  const opts = posProps.flyToOptions
    ? filterObject(posProps.flyToOptions, [
        "curve",
        "maxDuration",
        "minZoom",
        "screenSpeed",
        "speed"
      ])
    : {};

  if (posProps.center) opts.center = posProps.center;
  if (posProps.zoom) opts.zoom = posProps.zoom;

  map.flyTo(opts);
}

export const MapEvents = [
  "boxzoomstart",
  "click",
  "contextmenu",
  "data",
  "dataloading",
  "dblclick",
  "drag",
  "dragend",
  "dragstart",
  "error",
  "idle",
  "load",
  "mousedown",
  "mouseenter",
  "mouseleave",
  "mousemouve",
  "mouseout",
  "mouseover",
  "mouseup",
  "move",
  "moveend",
  "movestart",
  "pitch",
  "pitchend",
  "pitchstart",
  "remove",
  // 'render',
  "resize",
  "rotate",
  "rotateend",
  "rotatestart",
  "sourcedata",
  "sourcedataloading",
  "styledata",
  "styledataloading",
  "styleimagemissing",
  "touchcancel",
  "touchend",
  "touchstart",
  "webglcontextlost",
  "webglcontextrestored",
  "wheel",
  "zoom",
  "zoomend",
  "zoomstart"
];
export const MapEmits = [
  ...MapEvents,
  "update:center",
  "update:flyToOptions",
  "update:zoom",
  "update:pitch",
  "update:bearing",
  "loaded",
  "maperror",
  "mapopenstart",
  "mapopenfinish"
];

export const registerMapEvents = async (
  vmap: Deferred<Map>,
  instance: ComponentInternalInstance
) => {
  const map = await vmap.promise;
  duplicateEvents<Map>(map, instance, MapEvents);
  instance.emit("loaded", map);

  map.on("zoomend", evt => {
    instance.emit("update:zoom", evt.target.getZoom());
    instance.emit("update:center", evt.target.getCenter().toArray());
  });

  map.on("dragend", evt => {
    instance.emit("update:center", evt.target.getCenter().toArray());
  });

  map.on("pitchend", evt => {
    instance.emit("update:pitch", evt.target.getPitch());
  });

  map.on("rotateend", evt => {
    instance.emit("update:bearing", evt.target.getBearing());
  });
};
