import { LngLatInput } from "/@/lib/core/src/utils/types";
import { Map, Marker, MarkerOptions } from "vjmap";
import Deferred from "/@/lib/core/src/utils/deferred";
import { ComponentInternalInstance } from "vue";
import { Ref } from "vue";
import {
  duplicateEvents,
  filterObject,
  parentsNameIs,
  slotIsNotEmpty
} from "/@/lib/core/src/utils/vuehelper";
import { MarkerProps } from "./types";

export const parentIsMarker = (instance: any): boolean =>
  parentsNameIs(instance, "VjMarker");

export const getMarkerOptions = (props: MarkerOptions): MarkerOptions =>
  filterObject(props, [
    "element",
    "offset",
    "anchor",
    "color",
    "draggable",
    "clickTolerance",
    "rotation",
    "rotationAlignment",
    "pitchAlignment",
    "scale"
  ]);

export const MarkerEvents = ["drag", "dragend", "dragstart"];
export const MarkerEmits = [...MarkerEvents, "update:lngLat", "click"];

export const registerMarkerEvents = (
  marker: Marker,
  component: ComponentInternalInstance
) => {
  duplicateEvents<Marker>(marker, component, MarkerEvents);

  marker.on("dragend", (evt: any) =>
    component.emit("update:lngLat", evt.target._lngLat.toArray())
  );

  marker
    .getElement()
    .addEventListener("click", _ev => component.emit("click", _ev));
};

export const updateMarker = async (
  props: MarkerProps,
  vmarker: Deferred<Marker>
) => {
  const marker = await vmarker.promise;
  const opts = filterObject(props);

  if (typeof opts.draggable === "boolean") marker.setDraggable(opts.draggable);

  if (opts.lngLat) marker.setLngLat(opts.lngLat);

  if (opts.offset) marker.setOffset(opts.offset);

  if (opts.rotation) marker.setRotation(opts.rotation);

  if (opts.pitchAlignment) marker.setPitchAlignment(opts.pitchAlignment);

  if (opts.rotationAlignment)
    marker.setRotationAlignment(opts.rotationAlignment);
};

export const mountMarker = async (
  options: MarkerOptions,
  vmap: Deferred<Map>,
  vmarker: Deferred<Marker>,
  instance: ComponentInternalInstance,
  lngLat: LngLatInput,
  element?: Ref<HTMLElement>
) => {
  const map = await vmap.promise;
  if (element && slotIsNotEmpty(element.value)) options.element = element.value;

  const marker = new Marker(options).setLngLat(lngLat);

  marker.addTo(map);

  vmarker.resolve(marker);
};

export const updateOffset = async (
  vmarker: Deferred<Marker>,
  color: string
) => {
  const marker = await vmarker.promise;
};
