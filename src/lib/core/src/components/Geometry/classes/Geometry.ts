import { AnyLayer, AnyPaint, FillPaint, GeoJSONSourceRaw } from "vjmap";
import Deferred from "/@/lib/core/src/utils/deferred";
import { Circle } from "./GeometryCircle";
import { Polygon } from "./GeometryPolygon";
import { GeometryRaw } from "./GeometryRaw";
import { provide } from "vue";

export interface GeometryInput {
  id: string;
  fillColor?: string;
  outlineColor?: string;
  opacity?: number;
  antialias?: boolean;
}
export class Geometry {
  id: string;
  public fillColor: string;
  outlineColor?: string;
  opacity?: number;
  antialias?: boolean;
  deferred: Deferred<GeometryType>;

  static getGeoJSON: () => GeoJSONSourceRaw;
  static center: [number, number];

  constructor(input: GeometryInput) {
    this.id = input.id;
    this.fillColor = input.fillColor || "#4668F2";
    this.antialias =
      typeof input.antialias === "boolean" ? input.antialias : true;
    this.opacity = typeof input.opacity === "number" ? input.opacity : 0.6;

    if (input.outlineColor) this.outlineColor = input.outlineColor;

    this.deferred = new Deferred<GeometryType>();
    provide("vGeometry", this.deferred);
  }

  updateOptions(input: Partial<GeometryInput>) {
    if (input.fillColor) this.fillColor = input.fillColor;
    if (typeof input.antialias === "boolean") this.antialias = input.antialias;
    if (typeof input.opacity === "number") this.opacity = input.opacity;
    if (input.outlineColor) this.outlineColor = input.outlineColor;
  }

  getPaint(): AnyPaint {
    const paint = {} as FillPaint;

    if (this.fillColor) paint["fill-color"] = this.fillColor;
    if (this.antialias) paint["fill-antialias"] = this.antialias;
    if (this.opacity) paint["fill-opacity"] = this.opacity;
    if (this.outlineColor) paint["fill-outline-color"] = this.outlineColor;

    return paint;
  }

  getLayer(): AnyLayer {
    return {
      id: this.id,
      type: "fill",
      source: this.id,
      layout: {},
      paint: this.getPaint() as FillPaint
    };
  }
}

export type GeometryType = Circle | Polygon | GeometryRaw;
