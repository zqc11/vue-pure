import { UnwrapRef } from "vue";
import {
  MapOptions,
  FlyToOptions,
  IOpenMapParam,
  GeoBounds,
  LngLatLike
} from "vjmap";
import { ORef } from "/@/lib/core/src/utils/conditionalWatch";

export interface DivStyle {
  height: string;
  width: string;
  "--zoom-logo": number;
}

export interface MapInput extends MapOptions {
  mapStyle: string;
  height: string;
  width: string;
  flyToOptions: UnwrapRef<FlyToOptions>;
  autoResize: boolean;
  autoResizeDelay?: number;
  touchZoomRotate: boolean;
  serviceUrl: string;
  accessToken: string;
  openMapParam?: IOpenMapParam;
  mapBounds?: GeoBounds;
  isVectorStyle?: boolean;
  useInitView?: boolean /* 是否使用初始化视图信息，默认true */;
}

export interface regularProps {
  bearing: ORef<number>;
  maxBounds: ORef<any>;
  maxPitch: ORef<number>;
  minPitch: ORef<number>;
  pitch: ORef<number>;
  renderWorldCopies: ORef<boolean>;
}

export interface reactiveProps {
  center: UnwrapRef<LngLatLike>;
  flyToOptions: UnwrapRef<FlyToOptions>;
}

export interface positionProps {
  zoom?: ORef<number>;
  minZoom?: ORef<number>;
  maxZoom?: ORef<number>;
  center?: UnwrapRef<LngLatLike>;
  flyToOptions?: UnwrapRef<FlyToOptions>;
  touchZoomRotate?: any;
}

export interface positionPropsUnwrapped {
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  center?: UnwrapRef<LngLatLike>;
  flyToOptions?: UnwrapRef<FlyToOptions>;
}
