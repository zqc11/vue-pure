const polygon = (editor: any) => {
  let code: string = `let geoDatas = [];
let polygons;
// https://vjmap.com/doc/Class_Polygon.html
const createPolygons = (geoDatas) => {
    polygons = new vjmap.Polygon({
        data: geoDatas,
        // 如果是hover状态时，用红色，非hover状态时，取属性中的'color'做为颜色值
        fillColor: ['case', ['to-boolean', ['feature-state', 'hover']], 'red', ['get', 'color']],
        fillOpacity: 0.8,
        fillOutlineColor: "#f00",
        isHoverPointer: true,
        isHoverFeatureState: true
    });
    polygons.addTo(map);
    polygons.clickLayer(e => alert('您点击了第 ' + e.features[0].id + '个'))
    polygons.hoverPopup(f => '<h3>ID:' + f.properties.id + '</h3 > Color: ' + f.properties.color, { anchor: 'bottom' });
};

// 遍历里面所有的多边形
let features = featureCollection.features;
for (let i = 0; i < features.length; i++) {
    let geometry = features[i].geometry;
    if (geometry.type != 'Polygon') continue;
    geoDatas.push({
        points: map.toLngLat(geometry.coordinates[0]),
        properties: {
            color: vjmap.randomColor(),
            ...geometry.properties
        }
    })
}
createPolygons(geoDatas)

// 最后返回用于取消清空的函数
return {
    param: polygons,
    remove: (polygons) => {
        polygons.remove()
    }
}
`;
  editor.setValue(code);
};

const fillPattern = (editor: any) => {
  let code: string = `await map.loadImageEx("car", "/images/car.png");
let geoDatas = [];
let polygons;
const createPolygons = (geoDatas) => {
    polygons = new vjmap.Polygon({
        data: geoDatas,
        fillOpacity: ['case', ['to-boolean', ['feature-state', 'hover']], 0.8, 1.0],
        fillPattern: "car",
        fillOutlineColor: "#ff0",
        isHoverPointer: true,
        isHoverFeatureState: true
    });
    polygons.addTo(map);
    polygons.clickLayer(e => alert('您点击了第 ' + e.features[0].id + '个'))
    polygons.hoverPopup(f => '<h3>ID:' + f.properties.id + '</h3 > Color: ' + f.properties.color, { anchor: 'bottom' });
};

// 遍历里面所有的多边形
let features = featureCollection.features;
for (let i = 0; i < features.length; i++) {
    let geometry = features[i].geometry;
    if (geometry.type != 'Polygon') continue;
    geoDatas.push({
        points: map.toLngLat(geometry.coordinates[0]),
        properties: {
            color: vjmap.randomColor(),
            ...geometry.properties
        }
    })
}
createPolygons(geoDatas)

// 最后返回用于取消清空的函数
return {
    param: polygons,
    remove: (polygons) => {
        polygons.remove()
    }
}
`;
  editor.setValue(code);
};

export const polygonButtons = [
  {
    name: "多边形",
    click: polygon
  },
  {
    name: "填充图案",
    click: fillPattern
  }
];
