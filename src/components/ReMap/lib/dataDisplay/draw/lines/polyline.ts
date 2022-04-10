const polyline = (editor: any) => {
  let code: string = `let geoDatas = [];
let polylines;
// https://vjmap.com/doc/Class_Polyline.html
const createPolylines = (geoDatas) => {
    polylines = new vjmap.Polyline({
        data: geoDatas,
        // 如果是hover状态时，用红色，非hover状态时，取属性中的'color'做为颜色值
        lineColor: ['case', ['to-boolean', ['feature-state', 'hover']], 'red', ['get', 'color']],
        lineWidth: 5,
        isHoverPointer: true,
        isHoverFeatureState: true
    });
    polylines.addTo(map);
    polylines.clickLayer(e => alert('您点击了第 ' + e.features[0].id + '个'))
    polylines.hoverPopup(f => '<h3>ID:' + f.properties.id + '</h3 > Color: ' + f.properties.color, { anchor: 'bottom' });
};

// 遍历里面所有的线
let features = featureCollection.features;
for (let i = 0; i < features.length; i++) {
    let geometry = features[i].geometry;
    if (geometry.type != 'LineString') continue;
    geoDatas.push({
        points: map.toLngLat(geometry.coordinates),
        properties: {
            color: vjmap.randomColor(),
            ...geometry.properties
        }
    })
}
createPolylines(geoDatas)

// 最后返回用于取消清空的函数
return {
    param: polylines,
    remove: (polylines) => {
        polylines.remove()
    }
}
`;
  editor.setValue(code);
};

const dashPolyline = (editor: any) => {
  let code: string = `let geoDatas = [];
let polylines;
// https://vjmap.com/doc/Class_Polyline.html
const createPolylines = (geoDatas) => {
    polylines = new vjmap.Polyline({
        data: geoDatas,
        // 如果是hover状态时，用红色，非hover状态时，取属性中的'color'做为颜色值
        lineColor: ['case', ['to-boolean', ['feature-state', 'hover']], 'red', ['get', 'color']],
        lineWidth: 5,
        lineDasharray: [2 ,4],
        isHoverPointer: true,
        isHoverFeatureState: true
    });
    polylines.addTo(map);
    polylines.clickLayer(e => alert('您点击了第 ' + e.features[0].id + '个'))
    polylines.hoverPopup(f => '<h3>ID:' + f.properties.id + '</h3 > Color: ' + f.properties.color, { anchor: 'bottom' });
};

// 遍历里面所有的线
let features = featureCollection.features;
for (let i = 0; i < features.length; i++) {
    let geometry = features[i].geometry;
    if (geometry.type != 'LineString') continue;
    geoDatas.push({
        points: map.toLngLat(geometry.coordinates),
        properties: {
            color: vjmap.randomColor(),
            ...geometry.properties
        }
    })
}
createPolylines(geoDatas)

// 最后返回用于取消清空的函数
return {
    param: polylines,
    remove: (polylines) => {
        polylines.remove()
    }
}
`;
  editor.setValue(code);
};

const curveline = (editor: any) => {
  let code: string = `let geoDatas = [];
let polylines;
const createPolylines = (geoDatas) => {
    polylines = new vjmap.Polyline({
        data: geoDatas,
        // 如果是hover状态时，用红色，非hover状态时，取属性中的'color'做为颜色值
        lineColor: ['case', ['to-boolean', ['feature-state', 'hover']], 'red', ['get', 'color']],
        lineWidth: 5,
        isHoverPointer: true,
        isHoverFeatureState: true
    });
    polylines.addTo(map);
    polylines.clickLayer(e => alert('您点击了第 ' + e.features[0].id + '个'))
    polylines.hoverPopup(f => '<h3>ID:' + f.properties.id + '</h3 > Color: ' + f.properties.color, { anchor: 'bottom' });
};

// 遍历里面所有的线
let features = featureCollection.features;
for (let i = 0; i < features.length; i++) {
    let geometry = features[i].geometry;
    if (geometry.type != 'LineString') continue;
    let curvePath = geometry.coordinates;
    if (geometry.coordinates.length > 2) {
        // 把曲线上的点转为贝塞尔曲线参数
        const c = vjmap.polylineToBezierCurve(geometry.coordinates);
        // 据贝塞尔曲线参数离散成线
        curvePath = vjmap.bezierCurveToPolyline(c);
    }

    geoDatas.push({
        points: map.toLngLat(curvePath),
        properties: {
            color: vjmap.randomColor(),
            ...geometry.properties
        }
    })
}
createPolylines(geoDatas)

// 最后返回用于取消清空的函数
return {
    param: polylines,
    remove: (polylines) => {
        polylines.remove()
    }
}
`;
  editor.setValue(code);
};

const gradientPolyline = (editor: any) => {
  let code: string = `let lineSourceIds = []
const createGradPolyline = (data) => {
    let sourceId = 'gradlines' + vjmap.RandomID();
    map.addGeoJSONSource(sourceId, data, {
        lineMetrics: true
    });
    
    map.addLineLayer("lineLayer" + vjmap.RandomID(), sourceId, {
        lineColor: "#f00",
        lineWidth: 16,
        lineGradient:  [
            'interpolate',
            ['linear'],
            ['line-progress'],
            0,
            'blue',
            0.1,
            'royalblue',
            0.3,
            'cyan',
            0.5,
            'lime',
            0.7,
            'yellow',
            1,
            'red'
        ]
    });
    lineSourceIds.push(sourceId)
}


// 遍历里面所有的线
let features = featureCollection.features;
for (let i = 0; i < features.length; i++) {
    let geometry = features[i].geometry;
    if (geometry.type != 'LineString') continue;
    let geoDatas = {
        type: "FeatureCollection",
        features: [features[i]]
    }
    createGradPolyline(map.toLngLat(geoDatas))
}


// 最后返回用于取消清空的函数
return {
    param: {
        map,
        lineSourceIds
    },
    remove: ({map, lineSourceIds}) => {
        for(let id of lineSourceIds) {
            map.removeSourceEx(id);
        }
    }
}
`;
  editor.setValue(code);
};

const extrusionsPolyline = (editor: any) => {
  let code: string = `let geoDatas = [];
let fillExtrusions;

// 由多段线转成多边形
const polylineToPolygon = (path, offset) => {
    return vjmap.offsetPoints([...path, ...path.reverse()], {offset})
}

const createExtrusionsPolyline = (geoDatas) => {
    fillExtrusions = new vjmap.FillExtrusion({
        data: geoDatas,
        // 如果是hover状态时，用红色，非hover状态时，取属性中的'color'做为颜色值
        fillExtrusionColor: ['case', ['to-boolean', ['feature-state', 'hover']], 'red', ['get', 'color']],
        fillExtrusionOpacity: 0.8,
        fillExtrusionHeight:['get', 'height'],
        fillExtrusionBase: ['get', 'baseHeight'],
        isHoverPointer: true,
        isHoverFeatureState: true
    });
    fillExtrusions.addTo(map);
};

// 遍历里面所有的线
let features = featureCollection.features;
for (let i = 0; i < features.length; i++) {
    let geometry = features[i].geometry;
    if (geometry.type != 'LineString') continue;
    let path = polylineToPolygon(geometry.coordinates, 10)
    geoDatas.push({
        points: map.toLngLat(path),
        properties: {
            name: "line" + (i + 1),
            color: vjmap.randomColor(),
            type: "line",
            baseHeight: 0,
            height: vjmap.randInt(1000000, 2000000),
            ...geometry.properties
        }
    })
}
createExtrusionsPolyline(geoDatas)

if (map.getPitch() <= 5) {
    map.setPitch(60); // 如果没有倾斜，加个角度有效果
}


// 最后返回用于取消清空的函数
return {
    param: fillExtrusions,
    remove: (fillExtrusions) => {
        fillExtrusions.remove()
    }
}
`;
  editor.setValue(code);
};

const extrusionsPolylineAnim = (editor: any) => {
  let code: string = `let geoDatas = [];
let fillExtrusions;

// 由多段线转成多边形
const polylineToPolygon = (path, offset) => {
    return vjmap.offsetPoints([...path, ...path.reverse()], {offset})
}

const createExtrusionsPolyline = (geoDatas) => {
    fillExtrusions = new vjmap.FillExtrusion({
        data: geoDatas,
        // 如果是hover状态时，用红色，非hover状态时，取属性中的'color'做为颜色值
        fillExtrusionColor: ['case', ['to-boolean', ['feature-state', 'hover']], 'red', ['get', 'color']],
        fillExtrusionOpacity: 0.8,
        fillExtrusionHeight:['get', 'height'],
        fillExtrusionBase: ['get', 'baseHeight'],
        isHoverPointer: true,
        isHoverFeatureState: true
    });
    fillExtrusions.addTo(map);
};

// 遍历里面所有的线
let features = featureCollection.features;
for (let i = 0; i < features.length; i++) {
    let geometry = features[i].geometry;
    if (geometry.type != 'LineString') continue;
    let offset = 10;
    let path = polylineToPolygon(geometry.coordinates, offset)
    geoDatas.push({
        points: [], //点先设置为空
        properties: {
            name: "line" + (i + 1),
            color: vjmap.randomColor(),
            type: "line",
            baseHeight: 0,
            height: vjmap.randInt(1000000, 2000000),
            offset: offset,
            ...geometry.properties,
            path: path // 把点坐标保存进属性中
        }
    })
}
createExtrusionsPolyline(geoDatas)

// 复制下初始数据，防止以后更新
const initData = vjmap.cloneDeep(fillExtrusions.getData());
let anim = vjmap.createAnimation({
    from: 0,
    to: 1,
    repeatType: "reverse",// 交替反转动画
    repeat: Infinity,
    duration: 5000,
    ease:vjmap.linear, //线性
    onUpdate: latest => {
        const data = fillExtrusions.getData();
        for(let i = 0 ; i < data.features.length; i++) {
            const value = latest;
            const prop = initData.features[i].properties;
            const path = vjmap.interpolatePointsByRatio(prop.path, value);
            if (path.length > 1) {
                const polyPath = polylineToPolygon(path, prop.offset);
                const geojson = vjmap.createPolygonGeoJson(map.toLngLat(polyPath));
                if (geojson.features[0] && geojson.features[0].geometry) {
                    data.features[i].geometry.coordinates = geojson.features[0].geometry.coordinates;
                }
            }
        }
        fillExtrusions.setData(data);
        // 弄个灯光效果
        map.setLight({
            color: '#FFE9FE',
            intensity: latest
        });
    }
})


if (map.getPitch() <= 5) {
    map.setPitch(60); // 如果没有倾斜，加个角度有效果
}


// 最后返回用于取消清空的函数
return {
    param: {
        fillExtrusions,
        anim,
    },
    remove: ({fillExtrusions, anim}) => {
        anim.stop();
        fillExtrusions.remove()
    }
}
`;
  editor.setValue(code);
};

export const polylineButtons = [
  {
    name: "多段线",
    click: polyline
  },
  {
    name: "渐变线",
    click: gradientPolyline
  },
  {
    name: "虚线",
    click: dashPolyline
  },
  {
    name: "曲线",
    click: curveline
  },
  {
    name: "拉伸多段线",
    click: extrusionsPolyline
  },
  {
    name: "拉伸多段线动画",
    click: extrusionsPolylineAnim
  }
];
