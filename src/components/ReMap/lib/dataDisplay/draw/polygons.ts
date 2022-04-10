import { polygonButtons } from "./polygon/polygon";
import { extrusionButtons } from "./polygon/extrusion";
export const usePolygons = () => {
  return {
    polygonButtons: [...polygonButtons, ...extrusionButtons]
  };
};
