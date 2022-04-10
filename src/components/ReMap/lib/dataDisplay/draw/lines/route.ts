const route = (editor: any) => {
  let code: string = `let routes = [];
// 车图标
await map.loadImageEx("carIcon", "/images/car.png");
// https://vjmap.com/doc/Class_PolylineArrow.html
const createRoute = (path) => {
    let id = vjmap.RandomID();
    let sourceId = "carSource" + id;
    let layId = "carAnimate" + id;
    // 路径线
    let routeLine = new vjmap.PolylineArrow({
        path: path,
        lineWidth: 10,
        showDir: true,
        lineColor: '#009EFF'
    });
    routeLine.addTo(map);

    // 实时动画轨迹线
    let realRoute = new vjmap.PolylineArrow({
        path: path,
        lineWidth: 10,
        showDir: true,
        showBorder: true,
        borderColor: "#f00",
        lineColor: '#FF9900'
    });
    realRoute.addTo(map);

    
    // 车的数据源和图层
    map.addGeoJSONSource(sourceId);
    map.addSymbolLayer(layId, sourceId, {
        iconImage: 'carIcon',
        iconSize: 0.5,
        iconRotate: ['get', 'bearing'],
        iconRotationAlignment: 'map',
        iconAllowOverlap: true,
        iconIgnorePlacement: true
    })

    // 线动画
    const anim = realRoute.animate(100, 10, true, status => console.log(status), (status, context) => {
        // 动画每帧回调，在这里可以实时改变车的位置
        // 获取角度
        const angle = vjmap.geoPoint(context.endPnt).angleTo(vjmap.geoPoint(context.startPnt));
        // 生成新的数据
        const carGeoJson = vjmap.createPointGeoJson({
            point: context.endPnt,
            properties: { bearing: vjmap.radToDeg(-angle)}
        });
        // 更新车的数据
        map.setData(sourceId, carGeoJson); // 更新位置
    })
    
    routes.push({
        sourceId,
        routeLine,
        realRoute,
        anim
    });
};

// 遍历里面所有的线
let features = featureCollection.features;
for (let i = 0; i < features.length; i++) {
    let geometry = features[i].geometry;
    if (geometry.type != 'LineString') continue;
    createRoute(map.toLngLat(geometry.coordinates));
}


// 最后返回用于取消清空的函数
return {
    param: {
        map,
        routes
    },
    remove: ({map, routes}) => {
        for(let r of routes) {
            r.anim.stop();
            r.routeLine.remove();
            r.realRoute.remove();
            map.removeSourceEx(r.sourceId);
        }
    }
}
`;
  editor.setValue(code);
};

const dashRoute = (editor: any) => {
  let code: string = `let dashRoutes = []
const createDashRoute = (data) => {
    let sourceId = 'dashroute_' + vjmap.RandomID();
    let layerId = "lineLayer" + vjmap.RandomID();
    map.addGeoJSONSource(sourceId, data);

    let dash = [3, 3]; 
    let speed = 0.5; 
    let dashArraySeq = createDashArraySeq(dash, speed); 

    function createDashArraySeq(dash, speed = 1) {
        let dashArraySeq = [dash];
        for (let i = speed, len = dash[0] + dash[1]; i < len; i += speed) {
            const arr = [];
            if (i <= len - dash[0]) {
                arr.push(0, i, dash[0], dash[1] - i);
            } else {
                const leftFillCnt = i - (len - dash[0]);
                arr.push(leftFillCnt, dash[1], dash[0] - leftFillCnt, 0);
            }
            dashArraySeq.push(arr);
        }
        return dashArraySeq;
    }

    map.addLineLayer(layerId, sourceId, {
        lineColor: vjmap.randomColor(),
        lineWidth: 5,
        lineOpacity: 0.8,
        lineDasharray: dashArraySeq[0]
    });

    let dashArrayIdx = 0;
    let stopAnimationFrame = null;
    function animateLine(ts) {
        dashArrayIdx = (dashArrayIdx + 1) % dashArraySeq.length;
        map.setPaintProperty(layerId, 'line-dasharray', dashArraySeq[dashArrayIdx]);
        stopAnimationFrame = requestAnimationFrame(animateLine);
    }
    stopAnimationFrame = requestAnimationFrame(animateLine);
    dashRoutes.push({
        sourceId,
        stopAnimationFrame
    })
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
    createDashRoute(map.toLngLat(geoDatas))
}


// 最后返回用于取消清空的函数
return {
    param: {
        map,
        dashRoutes
    },
    remove: ({map, dashRoutes}) => {
        for(let route of dashRoutes) {
            cancelAnimationFrame(route.stopAnimationFrame);
            map.removeSourceEx(route.sourceId);
        }
    }
}
`;
  editor.setValue(code);
};

const patternRoute = (editor: any) => {
  let code: string = `await map.loadImageEx('arrow', '/images/arrow.png');
let sourceId = 'pattern_route_' + vjmap.RandomID();
let lineLayerId = "pattern_route_line_layer_" + vjmap.RandomID();
let symbolLayerId = "pattern_route_route_layer_" + vjmap.RandomID();
map.addGeoJSONSource(sourceId, map.toLngLat(featureCollection));
map.addSymbolLayer(symbolLayerId, sourceId, {
    iconImage: "arrow",
    symbolPlacement: 'line',
    iconAllowOverlap: true,
    iconRotationAlignment: "map",
    symbolSpacing: 64,
    iconSize: 1,
    iconOffset: [0,0],
    iconPadding: 0
});
map.addLineLayer(lineLayerId, sourceId, {
    lineColor: "green",
    lineWidth: 16,
    lineOpacity: 0.5
});

let anim = vjmap.createAnimation({
    from: 0,
    to: 64,
    repeat: Infinity,
    duration: 2000,
    ease:vjmap.linear, //线性
    onUpdate: latest => {
        map.setLayoutProperty(symbolLayerId, 'icon-offset', [latest, 0]);
    }
})

// 最后返回用于取消清空的函数
return {
    param: {
        map,
        sourceId,
        anim
    },
    remove: ({map, sourceId, anim}) => {
        anim.stop();
        map.removeSourceEx(sourceId);
    }
}
`;
  editor.setValue(code);
};

const symbolRoute = (editor: any) => {
  let code: string = `let geoLineDatas = [];
let geoPointDatas = [];

// 遍历里面所有的线
let features = featureCollection.features;
for (let i = 0; i < features.length; i++) {
    let geometry = features[i].geometry;
    if (geometry.type != 'LineString') continue;
    // 线
    geoLineDatas.push({
        points: map.toLngLat(geometry.coordinates),
        properties: {
            name: "line" + (i + 1),
            color: vjmap.randomColor(),
            type: "line"
        }
    })

    // 点
    // 获取角度
    const angle = vjmap.geoPoint(geometry.coordinates[1]).angleTo(vjmap.geoPoint(geometry.coordinates[0]));
    geoPointDatas.push({
        point: map.toLngLat(geometry.coordinates[0]),
        properties: {
            name:  'ID:' + (i + 1),
            bearing: vjmap.radToDeg(-angle),
            path: geometry.coordinates
        }
    });
}


let polylines = new vjmap.Polyline({
    data: geoLineDatas,
    // 如果是hover状态时，用红色，非hover状态时，取属性中的'color'做为颜色值
    lineColor: ['case', ['to-boolean', ['feature-state', 'hover']], 'red', ['get', 'color']],
    lineWidth: 20,
    lineOpacity: 0.4,
    isHoverPointer: true,
    isHoverFeatureState: true
});
polylines.addTo(map);

// 图标
await map.loadImageEx("car", "/images/car.png");
const symbols = new vjmap.Symbol({
    data: geoPointDatas,
    iconImage: "car",
    iconRotate: ['get', 'bearing'],
    iconAllowOverlap: true,
    iconRotationAlignment: 'map'
});

symbols.addTo(map);


const initData = vjmap.cloneDeep(symbols.getData());
let lastValue = 0;
let anim = vjmap.createAnimation({
    from: 0,
    to: 1,
    repeatType: "reverse",// 交替反转动画
    repeat: Infinity,
    duration: 5000,
    ease:vjmap.linear, //线性
    onUpdate: latest => {
        // 是否反转动画了,反转动画需要把车的方向改了
        let isReverse = lastValue > latest;
        lastValue = latest;
        const data = symbols.getData();
        for(let i = 0 ; i < data.features.length; i++) {
            const value = latest;
            const prop = initData.features[i].properties;
            const path = vjmap.interpolatePointsByRatio(prop.path, value);
            if (path.length > 1) {
                let start = path[path.length - 2];
                let end = path[path.length - 1];
                let angle = 0;
                if (isReverse) {
                    angle = vjmap.geoPoint(start).angleTo(vjmap.geoPoint(end));
                } else {
                    angle = vjmap.geoPoint(end).angleTo(vjmap.geoPoint(start));
                }
                // 更改方位
                data.features[i].properties.bearing = vjmap.radToDeg(-angle);

                // 更新坐标
                const geojson = vjmap.createPointGeoJson(map.toLngLat(end));
                if (geojson.features[0] && geojson.features[0].geometry) {
                    data.features[i].geometry.coordinates = geojson.features[0].geometry.coordinates;
                }
            }
        }
        symbols.setData(data);
    }
})

if (map.getPitch() <= 5) {
    map.setPitch(60); // 如果没有倾斜，加个角度有效果
}


// 最后返回用于取消清空的函数
return {
    param: {
        symbols,
        polylines,
        anim,
    },
    remove: ({symbols, polylines, anim}) => {
        anim.stop();
        symbols.remove()
        polylines.remove()
    }
}
`;
  editor.setValue(code);
};

export const routeButtons = [
  {
    name: "路径动画",
    click: route
  },
  {
    name: "虚线动画",
    click: dashRoute
  },
  {
    name: "箭头图案动画",
    click: patternRoute
  },
  {
    name: "图标路径动画",
    click: symbolRoute
  }
];
