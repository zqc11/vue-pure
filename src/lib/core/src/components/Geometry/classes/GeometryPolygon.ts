import { Geometry, GeometryInput } from "./Geometry";
import { GeoJSONSourceRaw } from "vjmap";

export type RadiusType = "absolute" | "relative";

export interface PolygonInput extends GeometryInput {
  path: Array<[number, number]>;
}

export class Polygon extends Geometry {
  path: Array<[number, number]>;

  constructor(input: PolygonInput) {
    super(input);
    this.path = input.path;
  }

  updateOptions(input: Partial<PolygonInput>) {
    super.updateOptions(input);
    if (input.path) this.path = input.path;
  }

  get center(): [number, number] {
    const sum = this.path.reduce((acc, c) => [acc[0] + c[0], acc[1] + c[1]]);
    return [sum[0] / this.path.length, sum[1] / this.path.length];
  }

  getGeoJSON(): GeoJSONSourceRaw {
    return {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [this.path]
            },
            properties: {}
          }
        ]
      }
    };
  }
}
