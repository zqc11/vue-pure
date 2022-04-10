import { NavigationControl, Map } from "vjmap";
import Deferred from "/@/lib/core/src/utils/deferred";
import { NavigationControlOptions, NavigationControlPosition } from "./types";

export const getNavigationControlOptions = (
  props: Partial<NavigationControlOptions>
): Partial<NavigationControlOptions> => {
  const { showCompass, showZoom, vizualizePitch } = props;

  return {
    showCompass,
    showZoom,
    vizualizePitch
  };
};

export const mountNavigationControl = (
  nav: NavigationControl,
  vmb_map: Deferred<Map>,
  position: NavigationControlPosition
) =>
  (async () => {
    const map = await vmb_map.promise;
    map.addControl(nav, position);
  })();
