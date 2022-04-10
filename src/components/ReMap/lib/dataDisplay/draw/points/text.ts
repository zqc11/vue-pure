const text = (editor: any) => {
  let code: string = `let texts = [];
// https://vjmap.com/doc/Class_Text.html
const createText = (lnglat, content) => {
    let text = new vjmap.Text({
        text: content,
        anchor: "top",
        draggable: false,

        style: {
            background: 'linear-gradient(#00ffff, #00ffff) left top,  linear-gradient(#00ffff, #00ffff) left top,     linear-gradient(#00ffff, #00ffff) right bottom,    linear-gradient(#00ffff, #00ffff) right bottom',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1px 6px, 6px 1px',
            backgroundColor: 'rgba(87,255,255, 0.3)',
            color: '#ffffff', 
            fontSize:'18px', 
            padding:'8px 12px',    
        }
    });
    text.setLngLat(lnglat).addTo(map);
    // 设置一些自定义的属性
    let customAttr = { "item": "test"};
    text.customAttr = customAttr;
    text.on('dragstart', (e) => {
        console.log("dragstart", e);
    });
    text.on('click', (e) => {
        // 获取自定义属性
        let txt = e.target;
        console.log("click", txt.customAttr.item);
    });
    text.on('mouseover', (e) => {
        console.log("mouseover", e);
    });
    text.on('mouseleave', (e) => {
        console.log("mouseleave", e);
    });
    text.on('dblclick', (e) => {
        console.log("dblclick", e);
    });
    text.on('contextmenu', (e) => {
        console.log("contextmenu", e);
    });
    text.on('mousedown', (e) => {
        console.log("mousedown", e);
    });
    text.on('mouseup', (e) => {
        console.log("mouseup", e);
    });

    texts.push(text);
};

// 遍历数据集合中的点元素
let features = featureCollection.features;
for (let i = 0; i < features.length; i++) {
    let geometry = features[i].geometry;
    if (geometry.type != 'Point') continue;
    createText(map.toLngLat(geometry.coordinates), '标识:' + (features[i].id || (i + 1))); 
}


// 最后返回用于取消清空的函数
return {
    param: texts,
    remove: (texts) => {
        for(let m of texts) {
            m.remove();
        }
    }
}
`;
  editor.setValue(code);
};

export const textButtons = [
  {
    name: "文本",
    click: text
  }
];
