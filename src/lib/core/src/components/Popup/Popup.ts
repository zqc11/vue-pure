import { Marker, Popup, PopupOptions, Map } from "vjmap";
import Deferred from "/@/lib/core/src/utils/deferred";
import { Ref } from "vue";
import { ComponentInternalInstance } from "vue";

import { parentIsMarker } from "../Marker/Marker";
import { parentIsGeometry } from "../Geometry/Geometry";
import { duplicateEvents, filterObject } from "/@/lib/core/src/utils/vuehelper";
import { PopupInput } from "./types";
import { GeometryPaintType } from "../Geometry/classes/Geometry.Paint";

export const attachToMarker = async (
  instance: any,
  vmarker: Deferred<Marker> | null,
  popup: Popup
) => {
  if (vmarker) {
    const marker = await vmarker.promise;
    marker.setPopup(popup);
  }
};

export const attachToGeometry = async (
  vmap: Deferred<Map>,
  vgeo_paint: Deferred<GeometryPaintType>,
  popup: Popup
) => {
  const paint = await vgeo_paint.promise;
  const map = await vmap.promise;
  if (paint.id) {
    const geo = await paint.Geometry.promise;

    map.on("click", paint.id, e => {
      const coordinates = geo.center;
      popup.setLngLat(coordinates).addTo(map);
    });
  }
};

export const getPopupOptions = (props: Partial<PopupOptions>): PopupOptions =>
  filterObject(props, [
    "closeButton",
    "closeOnClick",
    "closeOnMove",
    "focusAfterOpen",
    "anchor",
    "offset",
    "className",
    "maxWidth"
  ]);

export const mountPopup = async (
  // instance: ComponentInternalInstance | null,

  instance: any | null,
  vmap: Deferred<Map>,
  vpopup: Popup,
  vmarker: Deferred<Marker> | null,
  vGeometry_paint: Deferred<GeometryPaintType> | null,
  content: Ref<any>
) => {
  const map = await vmap.promise;
  const popup = vpopup;

  popup.setDOMContent(content.value);

  if (parentIsMarker(instance)) await attachToMarker(instance, vmarker, popup);
  else if (parentIsGeometry(instance) && vGeometry_paint) {
    await attachToGeometry(vmap, vGeometry_paint, popup);
  } else {
    popup.addTo(map);
  }
};

export const PopupGlEvents = ["close", "open"];
export const PopupEmits = [...PopupGlEvents];

export const registerPopupEvents = (
  vpopup: Popup,
  instance: ComponentInternalInstance
) => {
  duplicateEvents(vpopup, instance, PopupGlEvents);
};

export const updatePopup = async (props: PopupInput, vpopup: Popup) => {
  const opts = getPopupOptions(props);

  if (opts.maxWidth) vpopup.setMaxWidth(opts.maxWidth);

  if (opts.offset) vpopup.setOffset(opts.offset);

  if (props.lngLat) vpopup.setLngLat(props.lngLat);
};
