import { GeometryInput, GeometryType } from "./classes/Geometry";
import { Map } from "vjmap";
import Deferred from "/@/lib/core/src/utils/deferred";
import {
  filterObject,
  parentNameContains
} from "/@/lib/core/src/utils/vuehelper";
import {
  removeLayerIfPresent,
  removeSourceIfPresent
} from "/@/lib/core/src/shared/func";

export const parentIsGeometry = (instance: any): boolean =>
  parentNameContains(instance, "VjGeometry");

export const mountGeometry = async (
  vmap: Deferred<Map>,
  vGeometry: GeometryType
) => {
  const map = await vmap.promise;
  const Geometry = vGeometry;

  removeLayerIfPresent(Geometry.id, map);
  removeSourceIfPresent(Geometry.id, map);

  map.addSource(Geometry.id, Geometry.getGeoJSON());
  map.addLayer(Geometry.getLayer());
};

export const updateGeometry = async (
  props: Partial<GeometryInput>,
  vmap: Deferred<Map>,
  vGeometry: GeometryType
) => {
  const map = await vmap.promise;
  const geo = vGeometry;
  const opts = filterObject(props);
  const source = map.getSource(geo.id) as any;

  geo.updateOptions(opts);
  source.setData(geo.getGeoJSON().data);
};
