import vjmap, { GeoBounds, Map, GeoPoint, DivOverlay } from "vjmap";
import { MapGenerator } from "/@/lib/core/src/shared/mapExport";
import { sleep } from "./ui";

export const captureMapScreen = async (
  map: Map,
  imgWidth?: number,
  maxWidth?: number
) => {
  maxWidth = maxWidth ?? 300;
  const canvas = map.getCanvas();
  const canvasWH = Math.min(canvas.width, canvas.height, imgWidth ?? 300);
  const mapGen = new MapGenerator(map as any, [canvasWH, canvasWH]);
  const base64 = await mapGen.toBase64(maxWidth);
  return base64;
};

export const waitSourceLoaded = async (map: Map, sourceId: string) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    let i;
    for (i = 0; i < 300; i++) {
      if (map.isSourceLoaded(sourceId) && map.isStyleLoaded()) {
        resolve(true);
        break;
      }
      await sleep();
    }
    if (i >= 300) reject("timeout");
  });
};

export const createDivSvg = (
  map: Map,
  eleId: string,
  pt1: GeoPoint,
  pt2: GeoPoint,
  width: number,
  height: number,
  svg: string
) => {
  svg = svg.substring(svg.indexOf("<desc>"));
  const div = document.createElement("div");
  div.id = eleId;
  div.innerHTML = `
        <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMinYMin meet" version="1.1" xmlns="http://www.w3.org/2000/svg">
            ${svg}
        </svg>
    `;
  div.style.position = "absolute";
  div.style.pointerEvents = "none";
  div.style.width = width + "px";
  div.style.height = height + "px";
  //div.style.opacity = '0.8';

  const divOverlay = new DivOverlay({
    bounds: [
      [pt1.x, pt2.y],
      [pt1.x, pt1.y],
      [pt2.x, pt1.y],
      [pt2.x, pt2.y]
    ],
    element: div,
    width: width,
    height: height,
    updateDivSize: true // 如果svg需要放大，需要加此参数
  });
  divOverlay.addTo(map);
  return divOverlay;
};

export const flashPos = (map: Map, bounds: GeoBounds) => {
  return new Promise(resolve => {
    const routePath = [];
    routePath.push(bounds.min);
    routePath.push(vjmap.geoPoint([bounds.max.x, bounds.min.y]));
    routePath.push(bounds.max);
    routePath.push(vjmap.geoPoint([bounds.min.x, bounds.max.y]));
    routePath.push(bounds.min);
    const geoLineDatas = [];
    geoLineDatas.push({
      points: map.toLngLat(routePath),
      properties: {
        opacity: 1.0
      }
    });

    const polylines = new vjmap.Polyline({
      data: geoLineDatas,
      lineColor: "yellow",
      lineWidth: 3,
      lineOpacity: ["get", "opacity"],
      isHoverPointer: false,
      isHoverFeatureState: false
    });
    polylines.addTo(map);

    vjmap.createAnimation({
      from: 1,
      to: 10,
      duration: 1000,
      onUpdate: (e: any) => {
        const data = polylines.getData();
        // @ts-ignore
        data.features[0].properties.opacity = parseInt(e) % 2 ? 1.0 : 0;
        polylines.setData(data);
      },
      onStop: () => {
        polylines.remove();
        resolve({});
      },
      onComplete: () => {
        polylines.remove();
        resolve({});
      }
    });
  });
};
