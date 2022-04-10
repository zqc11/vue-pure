import { AnyLayer, AnyPaint } from "vjmap";
import Deferred from "/@/lib/core/src/utils/deferred";
import { provide } from "vue";
import { GeometryFill } from "./Geometry.Paint.Fill";
import { GeometryLine } from "./Geometry.Paint.Line";
import { GeometryType } from "./Geometry";

export type GeometryPaintType = GeometryFill | GeometryLine;

export interface GeometryPaintInput {
  Geometry: Deferred<GeometryType>;
  geoId?: string;
}
export class GeometryPaint {
  geoId?: string;
  id?: string;
  Geometry: Deferred<GeometryType>;
  deferred: Deferred<GeometryPaintType>;

  static getPaint: () => AnyPaint;
  static update: (...args: any) => void | Promise<void>;
  static getLayer: () => AnyLayer;

  constructor(input: GeometryPaintInput) {
    this.Geometry = input.Geometry;
    this.deferred = new Deferred<GeometryPaintType>();

    provide("vGeometry_paint", this.deferred);
  }

  async _init(paintType: string, id: string | number) {
    const Geometry = await this.Geometry.promise;
    this.geoId = Geometry.id;
    this.id = `${this.geoId}-${paintType}-${id}`;
  }

  setGeoId(id: string) {
    this.geoId = id;
  }
}
