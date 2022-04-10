const extrusionPolygon = (editor: any) => {
  let code: string = `let geoDatas = [];
let fillExtrusions;
// https://vjmap.com/doc/Class_FillExtrusion.html
const createExtrusions = (geoDatas) => {
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
    fillExtrusions.clickLayer(e => alert('您点击了第 ' + e.features[0].id + '个'))
    fillExtrusions.hoverPopup(f => '<h3>ID:' + f.properties.id + '</h3 > Color: ' + f.properties.color, { anchor: 'bottom' });
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
            baseHeight: 0,
            height: vjmap.randInt(1000000, 2000000),
            ...geometry.properties
        }
    })
}
createExtrusions(geoDatas)

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

const extrusionPolygonAnim = (editor: any) => {
  let code: string = `let geoDatas = []

// 遍历里面所有的多边形
let features = featureCollection.features;
for (let i = 0; i < features.length; i++) {
    let geometry = features[i].geometry;
    if (geometry.type != 'Polygon') continue;
    geoDatas.push({
        points: map.toLngLat(geometry.coordinates[0]),
        properties: {
            color: vjmap.randomColor(),
            color2:  vjmap.randomColor(),
            baseHeight: 0,
            height: vjmap.randInt(100000, 2000000),
            ...geometry.properties
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

export const extrusionButtons = [
  {
    name: "拉伸多边形",
    click: extrusionPolygon
  },
  {
    name: "拉伸多边形动画",
    click: extrusionPolygonAnim
  }
];
