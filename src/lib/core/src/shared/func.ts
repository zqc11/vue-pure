import { Map } from "vjmap";
// @ts-ignore
import loadImage from "blueimp-load-image";

export const removeLayerIfPresent = (id: string, map: Map): void => {
  const layer = map.getLayer(id);
  if (layer) map.removeLayer(id);
};

export const removeSourceIfPresent = (id: string, map: Map) => {
  const source = map.getSource(id);
  if (source) map.removeSource(id);
};

export const takeScreenshot = (
  map: Map,
  width?: number,
  retCanvas?: boolean
) => {
  return new Promise(function (resolve, _reject) {
    map.once("render", function () {
      if (width) {
        // 缩放
        const img = loadImage.scale(map.getCanvas(), {
          width,
          canvas: true,
          aspectRatio: 1,
          pixelRatio: 2,
          imageSmoothingEnabled: true,
          imageSmoothingQuality: "high"
        });
        if (retCanvas) {
          resolve(img);
        } else {
          resolve(img.toDataURL());
        }
      } else {
        if (retCanvas) {
          resolve(map.getCanvas());
        } else {
          resolve(map.getCanvas().toDataURL());
        }
      }
    });
    /* trigger render */
    map.setBearing(map.getBearing());
  });
};
