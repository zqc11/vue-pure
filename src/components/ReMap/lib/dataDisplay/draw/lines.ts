import { polylineButtons } from "./lines/polyline";
import { routeButtons } from "./lines/route";
export const useLines = () => {
  return {
    lineButtons: [...polylineButtons, ...routeButtons]
  };
};
