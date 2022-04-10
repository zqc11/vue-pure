import { Alignment, Anchor, LngLatLike, Marker, MarkerOptions } from "vjmap";

export interface MarkerProps extends MarkerOptions {
  lngLat?: LngLatLike;
}
