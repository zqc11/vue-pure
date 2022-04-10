import { Geometry, GeometryInput } from "./Geometry";
import { GeoJSONSourceRaw, Projection } from "vjmap";

export type RadiusType = "absolute" | "relative";

export interface CircleInput extends GeometryInput {
  radius: number;
  center: [number, number];
  edges?: number;
}

export class Circle extends Geometry {
  radius: number;
  center: [number, number];
  edges: number;

  constructor(input: CircleInput) {
    super(input);
    this.edges = input.edges || 10;
    this.radius = input.radius;
    this.center = input.center;
  }

  updateOptions(input: Partial<CircleInput>) {
    super.updateOptions(input);

    if (input.edges) this.edges = input.edges;
    if (input.radius) this.radius = input.radius;
    if (input.center) this.center = input.center;
  }

  getGeoJSON(): GeoJSONSourceRaw {
    const points = this.edges;

    let mct1 = Projection.lngLat2Mercator(this.center);
    let mct2 = Projection.lngLat2Mercator([
      this.center[0] + this.radius,
      this.center[1]
    ]);
    let radius = Math.abs(mct2[0] - mct1[0]);

    const path = [];

    for (let i = 0; i < points; i++) {
      const theta = (i / points) * (2 * Math.PI);
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      path.push(Projection.mercator2LngLat([mct1[0] + x, mct1[1] + y]));
    }
    path.push(path[0]);

    return {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [path]
            },
            properties: {}
          }
        ]
      }
    };
  }
}
