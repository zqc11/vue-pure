import vjmap, { Map, Marker, Polyline, Polygon, GeoBounds } from "vjmap";
import { clearHighlight, getHighlightEntities } from "../highlight";
import { changeActionUiStatus, doAction } from "../mapAction";
import { getMapSnapPoints } from "../snap";
import { dialog } from "../dialog";
import RandomData from "~/views/Dialog/randomData.vue";
import { showError } from "/@/utils/ui/ui";
const newRandomData = async (map: Map, editor: any) => {
  const res = await dialog({
    is: RandomData,
    props: {
      bounds: map.getGeoBounds(0.6).toString()
    },
    showBtn: false
  });
  if (res && res.cancel) return;
  const mapBounds = GeoBounds.fromString(res.bounds);
  const pointCount = +res.pointCount;
  const maxLineCount = +res.maxLineCount;
  const maxPointCount = +res.maxPointCount;
  const maxPolygonCount = +res.maxPolygonCount;
  const maxPolygonPointCount = +res.maxPolygonPointCount;
  const jsonFormat = res.jsonFormat;

  const FeatureCollection: any = {
    type: "FeatureCollection",
    features: []
  };

  if (pointCount > 0) {
    const coll = mapBounds.randomGeoJsonPointCollection(
      Math.max(pointCount, 2)
    );
    if (pointCount == 1) {
      // @ts-ignore
      FeatureCollection.features.push(coll.features[0]);
    } else {
      // @ts-ignore
      FeatureCollection.features.push(...coll.features);
    }
  }
  if (maxLineCount > 0) {
    const coll = mapBounds.randomGeoJsonLineCollection(
      maxLineCount,
      maxPointCount
    );
    // @ts-ignore
    FeatureCollection.features.push(...coll.features);
  }
  if (maxPolygonCount > 0) {
    const coll = mapBounds.randomGeoJsonPolygonCollection(
      maxPolygonCount,
      maxPolygonPointCount
    );
    // @ts-ignore
    FeatureCollection.features.push(...coll.features);
  }
  if (!jsonFormat) {
    // 转为数组
    const features = FeatureCollection.features.map(
      (f: any) => f.geometry.coordinates
    );
    editor.setValue(JSON.stringify(features, null, 4));
  } else {
    editor.setValue(JSON.stringify(FeatureCollection, null, 4));
  }
};

const pickPoints = async (map: Map, editor: any) => {
  // 在地图上拾取点
  const result = await doAction(async () => {
    await changeActionUiStatus({
      message: "请在图上点击选择点坐标, 按 回车 或 ESC 键退出选择!",
      disableButtons: true
    });

    const snapObj = {}; // 设置的捕捉的实体
    await getMapSnapPoints(map, snapObj);
    const features = [];
    let tempMarkers: Array<Marker> = [];
    const newLocal = true;
    while (newLocal) {
      const point = (await vjmap.Draw.actionDrawPoint(map, {
        api: {
          getSnapFeatures: snapObj //要捕捉的数据项在后面，通过属性features赋值
        }
      })) as any;
      if (point.cancel) {
        break;
      }
      features.push(...point.features);

      const marker = new Marker();
      marker.setLngLat(point.features[0].geometry.coordinates).addTo(map);
      tempMarkers.push(marker);
    }
    // 清空临时的
    for (const m of tempMarkers) {
      m.remove();
    }
    tempMarkers = [];

    await changeActionUiStatus({
      message: "",
      disableButtons: false
    });

    // 转成地理坐标
    return map.fromLngLat({
      type: "FeatureCollection",
      features: features
    });
  });
  if (result.sel == "ok") {
    editor.setValue(JSON.stringify(result.result, null, 4));
  }
};

const pickLines = async (map: Map, editor: any) => {
  // 图上绘制线
  const result = await doAction(async () => {
    await changeActionUiStatus({
      message: "请在图上绘制线, 按 回车 或 ESC 键退出选择!",
      disableButtons: true
    });

    const snapObj = {}; // 设置的捕捉的实体
    await getMapSnapPoints(map, snapObj);
    const features = [];
    let tempPolylines: Array<Polyline> = [];
    const newLocal_1 = true;
    while (newLocal_1) {
      const line = (await vjmap.Draw.actionDrawLineSting(map, {
        api: {
          getSnapFeatures: snapObj //要捕捉的数据项在后面，通过属性features赋值
        }
      })) as any;
      if (line.cancel) {
        break;
      }
      features.push(...line.features);

      const polyline = new vjmap.Polyline({
        data: line.features[0].geometry.coordinates,
        lineColor: vjmap.randomColor(),
        lineWidth: 5,
        isHoverPointer: true,
        isHoverFeatureState: false
      });
      polyline.addTo(map);
      tempPolylines.push(polyline);
    }

    // 清空临时的
    for (const m of tempPolylines) {
      m.remove();
    }
    tempPolylines = [];

    await changeActionUiStatus({
      message: "",
      disableButtons: false
    });

    // 转成地理坐标
    return map.fromLngLat({
      type: "FeatureCollection",
      features: features
    });
  });
  if (result.sel == "ok") {
    editor.setValue(JSON.stringify(result.result, null, 4));
  }
};

const pickPolygons = async (map: Map, editor: any) => {
  // 图上绘制多边形
  const result = await doAction(async () => {
    await changeActionUiStatus({
      message: "请在图上绘制多边形, 按 回车 或 ESC 键退出选择!",
      disableButtons: true
    });

    const snapObj = {}; // 设置的捕捉的实体
    await getMapSnapPoints(map, snapObj);
    const features = [];
    let tempPolygons: Array<Polygon> = [];
    const newLocal = true;
    while (newLocal) {
      const poly = (await vjmap.Draw.actionDrawPolygon(map, {
        api: {
          getSnapFeatures: snapObj //要捕捉的数据项在后面，通过属性features赋值
        }
      })) as any;
      if (poly.cancel) {
        break;
      }
      features.push(...poly.features);

      const polygon = new vjmap.Polygon({
        data: poly.features[0].geometry.coordinates[0],
        fillColor: vjmap.randomColor(),
        fillOpacity: 0.6,
        fillOutlineColor: "#f00",
        isHoverPointer: true,
        isHoverFeatureState: false
      });
      polygon.addTo(map);
      tempPolygons.push(polygon);
    }

    // 清空临时的
    for (const m of tempPolygons) {
      m.remove();
    }
    tempPolygons = [];

    await changeActionUiStatus({
      message: "",
      disableButtons: false
    });

    // 转成地理坐标
    return map.fromLngLat({
      type: "FeatureCollection",
      features: features
    });
  });
  if (result.sel == "ok") {
    editor.setValue(JSON.stringify(result.result, null, 4));
  }
};
const selectFeaturesUseGeomCoord = async (map: Map, editor: any) => {
  return await selectFeatures(map, editor, true);
};

const selectFeaturesUsePositionCoord = async (map: Map, editor: any) => {
  return await selectFeatures(map, editor, false);
};

const selectFeatures = async (map: Map, editor: any, useGeomCoord: boolean) => {
  if (
    map.getService().currentMapParam()?.mapopenway == vjmap.MapOpenWay.Memory
  ) {
    showError(
      "内存打开模式不支持框选实体，请切换至几何栅格或几何矢量方式打开图形"
    );
    return;
  }
  // 在地图上拾取点
  const result = await doAction(async () => {
    await changeActionUiStatus({
      message: "请在图上绘制矩形相交选择图上实体, 按 回车 或 ESC 键退出选择!",
      disableButtons: true
    });

    const snapObj = {}; // 设置的捕捉的实体
    await getMapSnapPoints(map, snapObj);
    const features = [];
    const newLocal_1 = true;
    while (newLocal_1) {
      const drawRect = (await vjmap.Draw.actionDrawRectangle(map, {
        api: {
          getSnapFeatures: snapObj //要捕捉的数据项在后面，通过属性features赋值
        }
      })) as any;
      if (drawRect.cancel) {
        break;
      }

      let co = drawRect.features[0].geometry.coordinates[0];
      co = map.fromLngLat(co);

      const geom = await getHighlightEntities(
        map,
        [co[0].x, co[0].y, co[2].x, co[1].y],
        useGeomCoord
      );

      features.push(
        ...geom.geometries.map(geom => {
          return {
            id: vjmap.RandomID(),
            type: "Feature",
            properties: {},
            geometry: geom
          };
        })
      );
    }

    // 清空之前临时高亮和实体
    clearHighlight(map);

    await changeActionUiStatus({
      message: "",
      disableButtons: false
    });

    // 转成地理坐标
    return map.fromLngLat({
      type: "FeatureCollection",
      features: features
    });
  });
  if (result.sel == "ok") {
    editor.setValue(JSON.stringify(result.result, null, 4));
  }
};

export const useData = () => {
  return {
    dataButtons: [
      {
        name: "随机数据",
        click: newRandomData
      },
      {
        name: "拾取点",
        click: pickPoints
      },
      {
        name: "采集线",
        click: pickLines
      },
      {
        name: "采集多边形",
        click: pickPolygons
      },
      {
        name: "选择实体[返回位置坐标]",
        click: selectFeaturesUsePositionCoord
      },
      {
        name: "选择实体[返回几何坐标]",
        click: selectFeaturesUseGeomCoord
      }
    ]
  };
};
