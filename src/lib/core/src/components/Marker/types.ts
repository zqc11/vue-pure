import { LngLatLike, MarkerOptions } from "vjmap";

export interface MarkerProps extends MarkerOptions {
  lngLat?: LngLatLike;
}
