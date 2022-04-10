import vjmap, { Map, IConditionQueryFeatures } from "vjmap";

export const addHighLightSourceLayer = (
  map: Map,
  layerId?: string,
  highlightColor?: string
) => {
  const name = layerId ?? "myhighlight";
  highlightColor = highlightColor ?? "#FF8957";
  //  数据源
  map.addGeoJSONSource(`${name}-source`, {
    type: "FeatureCollection",
    features: []
  });

  map.addLineLayer(`${name}-line-layer`, `${name}-source`, {
    lineJoin: "round",
    lineCap: "round",
    lineColor: highlightColor,
    lineWidth: 3,
    lineOpacity: 0.8,
    filter: ["==", ["geometry-type"], "LineString"]
  });

  map.addFillLayer(`${name}-fill-layer`, `${name}-source`, {
    fillColor: highlightColor,
    fillOpacity: 1.0,
    filter: ["==", ["geometry-type"], "Polygon"]
  });
};
export const clearHighLightSourceLayer = (map: Map, layerId?: string) => {
  const name = layerId ?? "myhighlight";
  if (map.getSource(`${name}-source`)) {
    // @ts-ignore
    map.getSource(`${name}-source`).setData({
      type: "FeatureCollection",
      features: []
    });
  }
};

export const getHighlightEntities = async (
  map: Map,
  bounds: [number, number, number, number],
  useGeomCoord?: boolean,
  queryParam?: IConditionQueryFeatures,
  isClearOld?: boolean,
  layerId?: string,
  highlightColor?: string
) => {
  const name = layerId ?? "myhighlight";
  const svc = map.getService();
  const res = await svc.conditionQueryFeature({
    condition: ``, // 只需要写sql语句where后面的条件内容,字段内容请参考文档"服务端条件查询和表达式查询"
    bounds: bounds, //查找此范围内的实体
    fields: "",
    includegeom: true, // 是否返回几何数据,为了性能问题，realgeom为false时，如果返回条数大于1.只会返回每个实体的外包矩形，如果条数为1的话，会返回此实体的真实geojson；realgeom为true时每条都会返回实体的geojson
    realgeom: true,
    isContains: bounds[0] > bounds[2], //矩形包含才行,false是相交关系
    limit: 1000, //设置很大，相当于把所有的圆都查出来。不传的话，默认只能取100条
    ...queryParam
  });

  const drawGeom = {
    geometries: [],
    type: "GeometryCollection"
  };

  const drawCoord = {
    geometries: [],
    type: "GeometryCollection"
  };

  if (res && res.result && res.result.length > 0) {
    if (!map.getSource(`${name}-source`)) {
      addHighLightSourceLayer(map, layerId, highlightColor); // 第一次初始化
    }

    for (const ent of res.result) {
      if (ent.geom && ent.geom.geometries) {
        // @ts-ignore
        drawGeom.geometries.push(...ent.geom.geometries);
      }
      if (!useGeomCoord) {
        // 使用位置坐标
        const coord =
          ent.points || ent.positon || ent.location || ent.origin || ent.center;
        if (coord) {
          const pts = coord.split(";");
          const points = pts.map((p: string) =>
            map.toLngLat(vjmap.GeoPoint.fromString(p))
          );

          if (points.length == 1) {
            drawCoord.geometries.push({
              // @ts-ignore
              type: "Point",
              // @ts-ignore
              coordinates: points[0]
            });
          } else if (points.length > 1) {
            drawCoord.geometries.push({
              // @ts-ignore
              type: "LineString",
              // @ts-ignore
              coordinates: points
            });
          }
        }
      }
    }
    if (drawGeom.geometries.length > 0) {
      // @ts-ignore
      if (!isClearOld && map.getSource(`${name}-source`)?._data?.geometries) {
        // @ts-ignore
        map.getSource(`${name}-source`).setData({
          geometries: [
            // @ts-ignore
            // eslint-disable-next-line no-unsafe-optional-chaining
            ...map.getSource(`${name}-source`)?._data?.geometries,
            // @ts-ignore
            ...drawGeom.geometries
          ],
          type: "GeometryCollection"
        });
      } else {
        // @ts-ignore
        map.getSource(`${name}-source`).setData(drawGeom);
      }
    } else {
      if (isClearOld) clearHighLightSourceLayer(map, name);
    }
  } else {
    if (isClearOld) clearHighLightSourceLayer(map, name);
  }
  map.triggerRepaint();
  return useGeomCoord ? drawGeom : drawCoord;
};

export const clearHighlight = (map: Map, layerId?: string) => {
  const name = layerId ?? "myhighlight";
  clearHighLightSourceLayer(map, name);
  map.triggerRepaint();
};
