import { markerButtons } from "./points/marker";
import { symbolButtons } from "./points/symbol";
import { textButtons } from "./points/text";

export const usePoints = () => {
  return {
    pointButtons: [...markerButtons, ...symbolButtons, ...textButtons]
  };
};
