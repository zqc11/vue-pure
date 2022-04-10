const symbol = (editor: any) => {
  let code: string = `let geoDatas = [];
// 文档地址: https://vjmap.com/doc/Class_Symbol.html
let symbols;
const createSymbols = async (geoDatas) => {
    // 先加载要显示的示例图片
    for(let i = 1; i <= 5; i++) {
        await map.loadImageEx("sensor" + i, "/images/sensor" + i + ".png");
    }
    symbols = new vjmap.Symbol({
        data: geoDatas,
        iconImage: ['get', 'icon'],
        iconOffset: [0, -20], // 图标高为40，默认在中心点，如果在底部指向点的话，应该偏移一半高度
        textField: ['get', 'icon'],
        textFont: ['Arial Unicode MS Regular'],
        textSize: 14,
        textColor: '#57ffff',
        textOffset: [0, 0],
        textAnchor: 'top',
        iconAllowOverlap: false, // 不允许重叠
        textAllowOverlap: false
    });
    symbols.addTo(map);
};

// 遍历里面所有的线
let features = featureCollection.features;
for (let i = 0; i < features.length; i++) {
    let geometry = features[i].geometry;
    if (geometry.type != 'Point') continue;
    geoDatas.push({
        point: map.toLngLat(geometry.coordinates),
        properties: {
            icon: "sensor" + vjmap.randInt(1, 5), // 设置图标名称
            ...geometry.properties
        }
    })
}
await createSymbols(geoDatas)

// 最后返回用于取消清空的函数
return {
    param: symbols,
    remove: (symbols) => {
        symbols.remove()
    }
}
`;
  editor.setValue(code);
};

const cluster = (editor: any) => {
  let code: string = `let geoDatas = [];
let sourceId = 'test-points' + vjmap.RandomID();
const createCluster = async (geoDatas) => {
    // 先加载要显示的示例图片
    for(let i = 1; i <= 5; i++) {
        await map.loadImageEx("icon" + i, "/images/sensor" + i + ".png");
    }
    
    let geoJsonData = featureCollection;
    map.addSource(sourceId, {
        type: 'geojson',
        data: map.toLngLat(geoJsonData),
        cluster: true,
        clusterMaxZoom: 10,
        clusterRadius: 60
    });

    //添加聚合图层
    let outerColors = [[1000, 'rgba(253, 156, 115, 0.6)'], [100, 'rgba(241, 211, 87, 0.6)'], [0, 'rgba(181, 226, 140, 0.6)']];

    outerColors.forEach(function (color, i) {
        map.addLayer({
            "id": "point-outer-cluster-" + i,
            "type": "circle",
            "source": sourceId,
            "paint": {
                "circle-color": color[1],
                "circle-radius": 20
            },
            "filter": i === 0 ?
                [">=", "point_count", color[0]] :
                ["all", [">=", "point_count", color[0]], ["<", "point_count", outerColors[i - 1][0]]]
        });
    });
    let innerColors = [[1000, 'rgba(241, 128, 23, 0.6)'], [100, 'rgba(240, 194, 12, 0.6)'], [0, 'rgba(110, 204, 57, 0.6)']];

    innerColors.forEach(function (color, i) {
        map.addLayer({
            "id": "point-inner-cluster-" + i,
            "type": "circle",
            "source": sourceId,
            "paint": {
                "circle-color": color[1],
                "circle-radius": 15
            },
            "filter": i === 0 ?
                [">=", "point_count", color[0]] :
                ["all", [">=", "point_count", color[0]], ["<", "point_count", innerColors[i - 1][0]]]
        });
    });


    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: sourceId,
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['simsun'],
            'text-size': 12
        }
    });

    map.addLayer({
        id: 'unclustered-point',
        type: 'symbol',
        source: sourceId,
        filter: ['!', ['has', 'point_count']],
        // 使用map.properties 把属性 驼峰式 写法改成 kebab-case 写法
        ...map.properties({
            // 这里的图标，是根据属性index取余而来
            // 对应js为 'icon' + (index % 5)
            // 这里只是为了演示下表达式的写法，通常情况下，直接把icon的值，放进geojson的properties中
            // 如 geojson.properties.icon = 'icon' + (index % 5),这里直接 通过 ['get', 'icon'] 获取即可
            iconImage: ["concat", "icon", ["to-string", ["%", ["to-number", ['get', 'index']], 5]]],
            iconOffset: [0, -17],
            textField: ['get', 'index'],
            textFont: ['Arial Unicode MS Regular'],
            textSize: 14,
            textColor: '#FFA0FD',
            textOffset: [0, 0],
            textAnchor: 'top',
            iconAllowOverlap: false,
            textAllowOverlap: false
        })
    });

    for(let i = 0; i < outerColors.length; i++) {
        let clusterLayer = "point-outer-cluster-" + i;
        map.on('click', clusterLayer, e => {
            let features = map.queryRenderedFeatures(e.point, {
                layers: [clusterLayer]
            });
            let clusterId = features[0].properties.cluster_id;
            map.getSource(sourceId)?.getClusterExpansionZoom(
                clusterId,
                function (err, zoom) {
                    if (err) return;

                    map.easeTo({
                        center: features[0].geometry.coordinates,
                        zoom: zoom
                    });
                }
            );
        });




        map.on('mouseenter', clusterLayer, e => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', clusterLayer, e => {
            map.getCanvas().style.cursor = '';
        });
    }


    map.on('click', 'unclustered-point', function (e) {
        let coordinates = e.features[0].geometry.coordinates.slice();
        let index = e.features[0].properties.index;

        new vjmap.Popup({
            offset: [0, -32]
        })
        .setLngLat(coordinates)
        .setHTML('第 ' + index  + '个点')
        .addTo(map);
    });


    map.on('mouseenter', 'unclustered-point', function () {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'unclustered-point', function () {
        map.getCanvas().style.cursor = '';
    });

};

// 遍历里面所有的线
let features = featureCollection.features;
for (let i = 0; i < features.length; i++) {
    let geometry = features[i].geometry;
    if (geometry.type != 'Point') continue;
    geoDatas.push({
        point: map.toLngLat(geometry.coordinates),
        properties: {
            icon: "sensor" + vjmap.randInt(1, 5), // 设置图标名称
            ...geometry.properties
        }
    })
}
await createCluster(geoDatas)

// 最后返回用于取消清空的函数
return {
    param: {
        map,
        sourceId
    },
    remove: ({map, sourceId}) => {
        map.removeSourceEx(sourceId)
    }
}
`;
  editor.setValue(code);
};

const circleSymbol = (editor: any) => {
  let code: string = `let souceId = 'ids' + vjmap.RandomID();
let layerId = 'ids-circle' + vjmap.RandomID();
// 创建为"ids"的geojson数据源
map.addGeoJSONSource(souceId, map.toLngLat(featureCollection));
// 创建关联"ids"的图层id为 'ids-circle'的圆图层
map.addCircleLayer(layerId, souceId, {
    // 根据hover不同的状态设置不同的颜色值
    circleColor: ['case', ['to-boolean', ['feature-state', 'hover']], 'red', '#FFA0FD'],
    // 根据hover不同的状态设置不同的宽度值
    circleStrokeWidth: ['case', ['to-boolean', ['feature-state', 'hover']], 2, 1],
});
// 设置图层的圆的半径
map.setCircleRadius([layerId], 12);
// 设置鼠标位于此图层上时，鼠标改变为 'pointer‘ 形状
map.hoverPointer([layerId]);
// 设置可以改变此图层的 hover state,用于根据hover不同的状态设置不同的值
map.hoverFeatureState(layerId);

// 最后返回用于取消清空的函数
return {
    param: {
        map,
        souceId
    },
    remove: ({map, souceId}) => {
        map.removeSourceEx(souceId);
    }
}
`;
  editor.setValue(code);
};

const symbolScatter = (editor: any) => {
  let code: string = `let souceId = 'symbol-scatter' + vjmap.RandomID();
let layerId = 'symbol-scatter-layer' + vjmap.RandomID();
const size = 200;

const scatterDot = {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),
    //将图层添加到地图时获取地图画布的渲染上下文
    onAdd: function () {
        let canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
    },

    // 在将使用图标的每一帧之前调用一次
    render: function () {
        const duration = 1500;
        const colorList = [0,150,0];
        let t = (performance.now() % duration) / duration;

        let radius = (size / 2) * 0.3;
        let outerRadius = (size / 2) * 0.7 * t + radius;
        let context = this.context;
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
        );
        context.fillStyle = 'rgba(' + colorList[0] + ',' + colorList[1] + ',' + colorList[2] + ',' + (1 - t) + ' )';
        context.fill();

        // draw inner circle
        context.beginPath();
        context.arc(
            this.width / 2,
            this.height / 2,
            radius,
            0,
            Math.PI * 2
        );
        this.data = context.getImageData(
            0,
            0,
            this.width,
            this.height
        ).data;

        // 不断地重绘地图，导致圆点的平滑动画
        map.triggerRepaint();

        // 返回 true 让地图知道图像已更新
        return true;

    }
};
if (!map.hasImage('scatter-dot')) {
    map.addImage('scatter-dot', scatterDot, { pixelRatio: 2 });
}

map.addGeoJSONSource(souceId, map.toLngLat(featureCollection));
map.addSymbolLayer(layerId, souceId, {
    iconImage: "scatter-dot",
    iconAllowOverlap: true,
    iconRotationAlignment: "map"
});

// 最后返回用于取消清空的函数
return {
    param: {
        map,
        souceId
    },
    remove: ({map, souceId}) => {
        map.removeSourceEx(souceId);
    }
}
`;
  editor.setValue(code);
};

const dotExtrusion = (editor: any) => {
  let code: string = `const mapBounds = map.getGeoBounds(0.6);
let len1 = mapBounds.width() / 100;
let len2 = mapBounds.width() / 200;
let len3 = mapBounds.width() / 300;
let geoDatas = []
// https://vjmap.com/doc/Class_FillExtrusion.html
// 遍历数据集合中的点元素
let features = featureCollection.features;
for (let i = 0; i < features.length; i++) {
    let geometry = features[i].geometry;
    if (geometry.type != 'Point') continue;
   
    const isSquare = vjmap.randInt(0, 1);
    const pts = []
    const len = vjmap.randInt(len1, len3);
    const p1 = vjmap.geoPoint(geometry.coordinates);
    const p2 = vjmap.geoPoint([p1.x, p1.y + len]);
    const p3 = vjmap.geoPoint([p1.x + len, p1.y + len]);
    pts.push(p1, p2, p3);
    if (isSquare) {
        pts.push(vjmap.geoPoint([p1.x + len, p1.y]));
    }
    geoDatas.push({
        points: map.toLngLat(pts),
        properties: {
            name: isSquare ? "square": "triangle" + (i + 1),
            color:  vjmap.randomColor(),
            color2:  vjmap.randomColor(),
            type: isSquare ? "square": "triangle",
            baseHeight: 0,
            height: vjmap.randInt(1000000, 2000000)
        }
    })
}

let fillExtrusions = new vjmap.FillExtrusion({
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
const initData = vjmap.cloneDeep(fillExtrusions.getData());

const mapProgressToValues = idx => vjmap.interpolate(
    [0, 1],
    [
        { color: initData.features[idx].properties.color, height: 500000 },
        { color: initData.features[idx].properties.color2, height: initData.features[idx].properties.height }
    ]
)
let anim = vjmap.createAnimation({
    from: 0,
    to: 1,
    repeat: Infinity,
    duration: 2000,
    onUpdate: latest => {
        const data = fillExtrusions.getData();
        for(let i = 0 ; i < data.features.length; i++) {
            const value = mapProgressToValues(i)(latest)
            data.features[i].properties.color = value.color;
            data.features[i].properties.height = value.height;
        }
        fillExtrusions.setData(data);
    }
})

// 最后返回用于取消清空的函数
return {
    param: {
        fillExtrusions,
        anim
    },
    remove: ({fillExtrusions, anim}) => {
        anim.stop();
        fillExtrusions.remove();
    }
}
`;
  editor.setValue(code);
};

const heatmap = (editor: any) => {
  let code: string = `let geoDatas = []
// 遍历数据集合中的点元素
let features = featureCollection.features;
for (let i = 0; i < features.length; i++) {
    let geometry = features[i].geometry;
    if (geometry.type != 'Point') continue;
    const data = {
        point:  map.toLngLat(geometry.coordinates),
        properties: {
           value: vjmap.randInt(0, 100),
           ...geometry.properties // 有value就值就用用户设置的，否则就用上面代码随机生成一个做为示例
        }
    }
    geoDatas.push(data)
}

let heatmapLayer = new vjmap.Heatmap({
    data: geoDatas,
    // heatmapWeight：表示一个点对热力图权重的贡献，在贡献越大的地方热力图显示应该越明显
    heatmapWeight:  [
        'interpolate',
        ['linear'],
        ['get', 'value'],
        0, // 因为上面用了0,100，最小和最大值，把这两个最小和最大值归化到0,1区间
        0,
        100,
        1
    ],
    // heatmapRadius：热力图的一个点计算权重的时候计算的点的半径，单位为像素，默认为30
    heatmapRadius: [
        'interpolate',
        ['linear'],
        ['zoom'],
        0, //0级别
        10, //半径10
        9, // 9级别 (其余级别，线性插值)
        50 // 半径50
    ],
    // heatmapColor：热力图的颜色，设置在各个热力图的数值上是什么颜色
    heatmapColor: [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(33,102,172,0)',
        0.2,
        'rgb(103,169,207)',
        0.4,
        'rgb(209,229,240)',
        0.6,
        'rgb(253,219,199)',
        0.8,
        'rgb(239,138,98)',
        1,
        'rgb(178,24,43)'
    ],
    //heatmapIntensity：热力图强度，有点类似于heatmapWeight属性，但是该属性是设置整体上热力图的强度
    heatmapIntensity: [
        'interpolate',
        ['linear'],
        ['zoom'],
        0,
        1,
        9,
        3
    ],
    //heatmapOpacity：热力图的透明度
    heatmapOpacity: [
        'interpolate',
        ['linear'],
        ['zoom'],
        7,
        1,
        9,
        0
    ]
});
heatmapLayer.addTo(map);

// 最后返回用于取消清空的函数
return {
    param: heatmapLayer,
    remove: (heatmapLayer) => {
        heatmapLayer.remove();
    }
}
`;
  editor.setValue(code);
};
export const symbolButtons = [
  {
    name: "点符号",
    click: symbol
  },
  {
    name: "点聚合",
    click: cluster
  },
  {
    name: "圆符号",
    click: circleSymbol
  },
  {
    name: "圆形扩散",
    click: symbolScatter
  },
  {
    name: "点拉伸动画",
    click: dotExtrusion
  },
  {
    name: "热力图",
    click: heatmap
  }
];
