const marker = (editor: any) => {
  let code: string = `let markers = [];
// 文档地址 https://vjmap.com/doc/Marker.html
const createMarker = (lnglat) => {
    let marker = new vjmap.Marker();
    marker.setLngLat(lnglat).addTo(map);
    markers.push(marker);
};

// 遍历数据集合中的点元素
let features = featureCollection.features;
for (let i = 0; i < features.length; i++) {
    let geometry = features[i].geometry;
    if (geometry.type != 'Point') continue;
    createMarker(map.toLngLat(geometry.coordinates)); 
}

// 如果要想绘制数据中，包括线和多边形的所有点，请用以下代码 
/*
// 遍历里面数据集合中所有的点
vjmap.transform.convert(featureCollection, pt => {
    createMarker(map.toLngLat(pt)); 
    return pt; // 不做改变,只用于绘制
})
*/

// 最后返回用于取消清空的函数
return {
    param: markers,
    remove: (markers) => {
        for(let m of markers) {
            m.remove();
        }
    }
}
`;
  editor.setValue(code);
};

const popup = (editor: any) => {
  let code: string = `let popups = [];
// 文档地址 https://vjmap.com/doc/Popup.html
const createPopup = (lnglat, content) => {
    // 参数说明
    // className  自定义样式类名，如为空，表示默认
    // closeButton，true表示会展示一个关闭按钮；
    // closeOnClick，设置为true表示当地图被点击时该信息窗体会被关闭；
    // offset，参数为点位置相对于其左上角偏移像素大小；
    // anchor，停靠点，值域为[top,bottom,left,right,top-left,top-right,bottom-left,bottom-right]，如果不设置该参数，则会根据map container动态调整。
    // autoPan，设置为true时，当地图拖动到看不到popup的时候，自动将地图平移到可以看到popup，此参数只对固定popup有效；
    const popup = new vjmap.Popup({ className:"custom-popup", closeOnClick: false, closeButton: true, anchor: "bottom" });
    popup.setHTML(content)
        .setLngLat(lnglat)
        .addTo(map);
    popups.push(popup);
};

// 遍历数据集合中的点元素
let features = featureCollection.features;
for (let i = 0; i < features.length; i++) {
    let geometry = features[i].geometry;
    if (geometry.type != 'Point') continue;
    createPopup(map.toLngLat(geometry.coordinates), 'id:' + (features[i].id || (i + 1))); 
}

// 最后返回用于取消清空的函数
return {
    param: popups,
    remove: (popups) => {
        for(let m of popups) {
            m.remove();
        }
    }
}
`;
  editor.setValue(code);
};

const markerPopup = (editor: any) => {
  let code: string = `let markers = [];
// 文档地址 https://vjmap.com/doc/Marker.html
// 文档地址 https://vjmap.com/doc/Popup.html
const createMarkerPopup = (lnglat, content) => {
    // 这里marker用自定义图标做为演示
    let el = document.createElement('div');
    el.className = 'marker';
    let imgIdx = vjmap.randInt(1, 5)
    el.style.backgroundImage = 'url("/images/sensor' + imgIdx + '.png")';
    el.style.width = '40px';
    el.style.height = '40px';
    el.style.backgroundSize = '100%';

    let marker = new vjmap.Marker({
        element: el,
        anchor: 'bottom',
        draggable: true // 设置可拖动
    });
    marker.setLngLat(lnglat).addTo(map);

    // add popup
    let popup = new vjmap.Popup({
        offset: [0, -40]
    });
    popup.setHTML("<div></div><h3>唯杰地图</h3><p>" + content + "</p></div>")
    marker.setPopup(popup);

    if (imgIdx == 1) {
        // 模拟一开始打开popup的情况
        marker.togglePopup();
    }
    
    markers.push(marker);
};

// 遍历数据集合中的点元素
let features = featureCollection.features;
for (let i = 0; i < features.length; i++) {
    let geometry = features[i].geometry;
    if (geometry.type != 'Point') continue;
    createMarkerPopup(map.toLngLat(geometry.coordinates), 'id:' + (features[i].id || (i + 1))); 
}

// 最后返回用于取消清空的函数
return {
    param: markers,
    remove: (markers) => {
        for(let m of markers) {
            m.remove();
        }
    }
}
`;
  editor.setValue(code);
};

export const markerButtons = [
  {
    name: "点标记",
    click: marker
  },
  {
    name: "信息框",
    click: popup
  },
  {
    name: "点标记信息框",
    click: markerPopup
  }
];
