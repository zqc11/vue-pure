const coneMesh = (editor: any) => {
  let code: string = `
let threeContext = map.getCustomKeyValue("threeContext") ;// 如果加过就不用再加了
if (!threeContext) {
    threeContext = map.createThreeJsContext({
        defaultLights: true,
        enableSelectingObjects: false
    });
    const threeLayer = new vjmap.ThreeLayer({ context: threeContext });
    map.addLayer(threeLayer);
    map.setCustomKeyValue("threeContext", threeContext);
}

/*
// https://vjmap.com/guide/threejs.html
// 创建一个四棱锥
coneMesh(co: GeoPoint, opts?:  {
    size?: number // 大小，默认 1024
    height?: number // 大小，默认 4096
    color?: string | number // 颜色，默认 0xffcc00
    animation?: boolean // 是否有动画，默认 true
    animationUpDown?: boolean // 是否有上升下降动画。默认如果有z值就有动画，默认 true 
    obj3dOpts?: object // Object3D选项
}): any
*/

let coneMeshs = [];
const createConeMesh = (coord) => {
    coord.z = 100;
    let coneMesh = threeContext.coneMesh(coord, {
        size: 10240,
        color: vjmap.randomColor()
    });
    coneMeshs.push(coneMesh)
};

// 遍历数据集合中的点元素
let features = featureCollection.features;
for (let i = 0; i < features.length; i++) {
    let geometry = features[i].geometry;
    if (geometry.type != 'Point') continue;
    createConeMesh(geometry.coordinates); 
}

if (map.getPitch() <= 5) {
    map.setPitch(60); // 如果没有倾斜，加个角度有效果
}

// 最后返回用于取消清空的函数
return {
    param: {
        threeContext,
        coneMeshs,
    },
    remove: (param) => {
        for(let c of param.coneMeshs) {
            c.stop();
            threeContext.remove(c)
        }
    }
}
`;
  editor.setValue(code);
};

const flyDot = (editor: any) => {
  let code: string = `
let threeContext = map.getCustomKeyValue("threeContext") ;// 如果加过就不用再加了
if (!threeContext) {
    threeContext = map.createThreeJsContext({
        defaultLights: true,
        enableSelectingObjects: false
    });
    const threeLayer = new vjmap.ThreeLayer({ context: threeContext });
    map.addLayer(threeLayer);
    map.setCustomKeyValue("threeContext", threeContext);
}

/*
// https://vjmap.com/guide/threejs.html
// 创建一条飞行线
flyline(opts:  {
    source: GeoPoint, //  起点
        target: GeoPoint // 终点，
    height?: number // 插值中点值的高度
    size?: number // 粒子大小，默认 3 
    color: string | number // 颜色
    color2?: string | number // 如果需要渐变颜色，设置这个值
    count?: number // 粒子总数  默认 1000 
    range?: number // 显示粒子的范围数，默认 500 
    opacity?: number // 透明度，默认 1.0 
    speed?: number // 速度，默认 1 
}): any
*/

let flylines = [];
const createFlyline = (coord) => {
    let mesh = threeContext.flyline({
        source: {
            x: coord[0],
            y: coord[1],
            z: 0
        },
        target: {
            x: coord[0],
            y: coord[1],
            z: 500000,
        },
        count: 1000,
        range: 500,
        height: 0,
        color: vjmap.randomColor(),
        color2: vjmap.randomColor(),
        speed: 1,
        size: 3,
        opacity: 1.0,
    });
    flylines.push(mesh);
};

// 遍历数据集合中的点元素
let features = featureCollection.features;
for (let i = 0; i < features.length; i++) {
    let geometry = features[i].geometry;
    if (geometry.type != 'Point') continue;
    createFlyline(geometry.coordinates); 
}

if (map.getPitch() <= 5) {
    map.setPitch(60); // 如果没有倾斜，加个角度有效果
}

// 最后返回用于取消清空的函数
return {
    param: {
        threeContext,
        flylines,
    },
    remove: (param) => {
        for(let c of param.flylines) {
            c.stop();
            threeContext.remove(c)
        }
    }
}
`;
  editor.setValue(code);
};

const wave = (editor: any) => {
  let code: string = `
let threeContext = map.getCustomKeyValue("threeContext") ;// 如果加过就不用再加了
if (!threeContext) {
    threeContext = map.createThreeJsContext({
        defaultLights: true,
        enableSelectingObjects: false
    });
    const threeLayer = new vjmap.ThreeLayer({ context: threeContext });
    map.addLayer(threeLayer);
    map.setCustomKeyValue("threeContext", threeContext);
}

/*
// https://vjmap.com/guide/threejs.html
// 创建一个波动光圈
wave(co: GeoPoint, opts?:  {
    size?: number // 大小，默认 3413
    color?: string | number // 颜色，默认 0x22ffcc
    texture?: string // 波动光圈纹理图片
    speed?: number // 速度，默认 0.4
}): any
*/

let waves = [];
const createWave = (coord) => {
    let wave = threeContext.wave(vjmap.geoPoint(coord), {
        color: vjmap.randomColor()
    });
    waves.push(wave);
};

// 遍历数据集合中的点元素
let features = featureCollection.features;
for (let i = 0; i < features.length; i++) {
    let geometry = features[i].geometry;
    if (geometry.type != 'Point') continue;
    createWave(geometry.coordinates); 
}

if (map.getPitch() <= 5) {
    map.setPitch(60); // 如果没有倾斜，加个角度有效果
}

// 最后返回用于取消清空的函数
return {
    param: {
        threeContext,
        waves,
    },
    remove: (param) => {
        for(let c of param.waves) {
            c.stop();
            threeContext.remove(c)
        }
    }
}
`;
  editor.setValue(code);
};

const radar = (editor: any) => {
  let code: string = `
let threeContext = map.getCustomKeyValue("threeContext") ;// 如果加过就不用再加了
if (!threeContext) {
    threeContext = map.createThreeJsContext({
        defaultLights: true,
        enableSelectingObjects: false
    });
    const threeLayer = new vjmap.ThreeLayer({ context: threeContext });
    map.addLayer(threeLayer);
    map.setCustomKeyValue("threeContext", threeContext);
}

/*
// https://vjmap.com/guide/threejs.html
// 创建一个扫描雷达
radar(co: GeoPoint, opts?:  {
    size?: number // 大小，默认 20480
    color1?: string | number // 雷达扫描颜色，默认 0x00ffff
    texture1: string // 雷达扫描纹理图片
    color2?: string | number // 雷达刻度颜色，默认 0x00cccc
    texture2: string // 雷达刻度纹理图片
    speed?: number // 速度，默认 0.02
}): any
*/

let radars = [];
const createRadar = (coord) => {
    let pt = new vjmap.Point(coord[0], coord[1]);
    let radar = threeContext.radar(pt, {
        texture1: '/images/radarScanning.png',
        texture2: '/images/radarLabels.png',
        color1: vjmap.randomColor(),
        color2: vjmap.randomColor()
    });
    radars.push(radar);
};

// 遍历数据集合中的点元素
let features = featureCollection.features;
for (let i = 0; i < features.length; i++) {
    let geometry = features[i].geometry;
    if (geometry.type != 'Point') continue;
    createRadar(geometry.coordinates); 
}

if (map.getPitch() <= 5) {
    map.setPitch(60); // 如果没有倾斜，加个角度有效果
}

// 最后返回用于取消清空的函数
return {
    param: {
        threeContext,
        radars,
    },
    remove: (param) => {
        for(let c of param.radars) {
            c.stop();
            threeContext.remove(c)
        }
    }
}
`;
  editor.setValue(code);
};

const radialGradient = (editor: any) => {
  let code: string = `
let threeContext = map.getCustomKeyValue("threeContext") ;// 如果加过就不用再加了
if (!threeContext) {
    threeContext = map.createThreeJsContext({
        defaultLights: true,
        enableSelectingObjects: false
    });
    const threeLayer = new vjmap.ThreeLayer({ context: threeContext });
    map.addLayer(threeLayer);
    map.setCustomKeyValue("threeContext", threeContext);
}

/*
// https://vjmap.com/guide/threejs.html
// 创建一个径向渐变球
radialGradient(co: GeoPoint, opts?:  {
    size?: number // 大小，默认 10240
    color?: string | number | any/* 颜色，默认 new THREE.Vector3(0.0,1.0,1.0)
    speed?: number // 速度，默认 0.02
}): any
*/

let radialGradients = [];
const createRadialGradient = (coord) => {
    let mesh = threeContext.radialGradient(vjmap.geoPoint(coord), {
        color: new THREE.Vector3(Math.random(), Math.random(), Math.random())
    });
    radialGradients.push(mesh)
};

// 遍历数据集合中的点元素
let features = featureCollection.features;
for (let i = 0; i < features.length; i++) {
    let geometry = features[i].geometry;
    if (geometry.type != 'Point') continue;
    createRadialGradient(geometry.coordinates); 
}

if (map.getPitch() <= 5) {
    map.setPitch(60); // 如果没有倾斜，加个角度有效果
}

// 最后返回用于取消清空的函数
return {
    param: {
        threeContext,
        radialGradients,
    },
    remove: (param) => {
        for(let c of param.radialGradients) {
            c.stop();
            threeContext.remove(c)
        }
    }
}
`;
  editor.setValue(code);
};

const waveWall = (editor: any) => {
  let code: string = `
let threeContext = map.getCustomKeyValue("threeContext") ;// 如果加过就不用再加了
if (!threeContext) {
    threeContext = map.createThreeJsContext({
        defaultLights: true,
        enableSelectingObjects: false
    });
    const threeLayer = new vjmap.ThreeLayer({ context: threeContext });
    map.addLayer(threeLayer);
    map.setCustomKeyValue("threeContext", threeContext);
}

let waveWalls = [];
/*
// https://vjmap.com/guide/threejs.html
// 创建一个波动光圈
waveWall(co: GeoPoint, opts?:  {
    size?: number // 大小，默认 10240 
    height?: number // 大小，默认 2000 
    color?: string | number // 颜色，默认 0x00ffff
    texture?: string // 纹理图片
    speed?: number // 速度，默认 0.1
    opacity?: number // 透明度，默认 0.5
}): any
*/
const createWaveWall = (coord) => {
    let mesh = threeContext.waveWall(vjmap.geoPoint(coord), {
        size: 4000
    });
    waveWalls.push(mesh)
};

// 遍历数据集合中的点元素
let features = featureCollection.features;
for (let i = 0; i < features.length; i++) {
    let geometry = features[i].geometry;
    if (geometry.type != 'Point') continue;
    createWaveWall(geometry.coordinates); 
}

if (map.getPitch() <= 5) {
    map.setPitch(60); // 如果没有倾斜，加个角度有效果
}

// 最后返回用于取消清空的函数
return {
    param: {
        threeContext,
        waveWalls,
    },
    remove: (param) => {
        for(let c of param.waveWalls) {
            c.stop();
            threeContext.remove(c)
        }
    }
}
`;
  editor.setValue(code);
};

const flyline = (editor: any) => {
  let code: string = `
let threeContext = map.getCustomKeyValue("threeContext") ;// 如果加过就不用再加了
if (!threeContext) {
    threeContext = map.createThreeJsContext({
        defaultLights: true,
        enableSelectingObjects: false
    });
    const threeLayer = new vjmap.ThreeLayer({ context: threeContext });
    map.addLayer(threeLayer);
    map.setCustomKeyValue("threeContext", threeContext);
}

/*
// https://vjmap.com/guide/threejs.html
// 创建一条飞行线
flyline(opts:  {
    source: GeoPoint, //  起点
    target: GeoPoint // 终点，
    height?: number // 插值中点值的高度
    size?: number // 粒子大小，默认 3 
    color: string | number // 颜色
    color2?: string | number // 如果需要渐变颜色，设置这个值
    count?: number // 粒子总数  默认 1000 
    range?: number // 显示粒子的范围数，默认 500 
    opacity?: number // 透明度，默认 1.0 
    speed?: number // 速度，默认 1 
}): any
*/

let flylines = [];
const createFlyline = (pt1, pt2) => {
    let mesh = threeContext.flyline({
        source: {
            x: pt1[0],
            y: pt1[1],
            z: 0
        },
        target: {
            x: pt2[0],
            y: pt2[1],
            z: 0,
        },
        count: 1000,
        range: 500,
        height: 300000,
        color: vjmap.randomColor(),
        color2: vjmap.randomColor(),
        speed: 1,
        size: 3,
        opacity: 1.0,
    });
    flylines.push(mesh);
};

// 遍历数据集合中的点元素
let features = featureCollection.features;
for (let i = 0; i < features.length; i++) {
    let geometry = features[i].geometry;
    if (geometry.type != 'LineString') continue;
    if (geometry.coordinates.length < 2) continue;
    createFlyline(geometry.coordinates[0], geometry.coordinates[1]); 
}

if (map.getPitch() <= 5) {
    map.setPitch(60); // 如果没有倾斜，加个角度有效果
}

// 最后返回用于取消清空的函数
return {
    param: {
        threeContext,
        flylines,
    },
    remove: (param) => {
        for(let c of param.flylines) {
            c.stop();
            threeContext.remove(c)
        }
    }
}
`;
  editor.setValue(code);
};

const wall = (editor: any) => {
  let code: string = `
let threeContext = map.getCustomKeyValue("threeContext") ;// 如果加过就不用再加了
if (!threeContext) {
    threeContext = map.createThreeJsContext({
        defaultLights: true,
        enableSelectingObjects: false
    });
    const threeLayer = new vjmap.ThreeLayer({ context: threeContext });
    map.addLayer(threeLayer);
    map.setCustomKeyValue("threeContext", threeContext);
}

let walls = [];
/*
// https://vjmap.com/guide/threejs.html
// 创建一个立体光墙
wall(pts: GeoPoint[], opts?:  {
   height?: number // 立体光墙高度，默认 10000 
   flyline?: boolean // 光墙旁边有飞线效果，默认有 
   repeatX?: number // 光墙飞线纹理x重复贴图次数，默认 3 
   repeatY?: number // 光墙飞线纹理y重复贴图次数，默认 3 
   offsetX?: number // 光墙飞线纹理x动画每次偏移值，默认 0.02 
   offsetY?: number // 光墙飞线纹理y重复贴图次数，默认 0 
   color1?: string | number // 光墙飞线颜色，默认 0xffff00 
   texture1?: string // 光墙飞线纹理图片 
   color2?: string | number // 立体光墙颜色，默认 0x00ffff 
   texture2?: string // 立体光墙纹理图片 
   opacity?: number // 立体光墙透明度，默认  0.5  
   obj3dOpts?: object // Object3D选项 
}): any
*/
const createWaveWall = (pts) => {
    let wall = threeContext.wall(pts, {
        color1: vjmap.randomColor(),
        color2: vjmap.randomColor()
    })
    walls.push(wall)
};

// 遍历数据集合中的点元素
let features = featureCollection.features;
for (let i = 0; i < features.length; i++) {
    let geometry = features[i].geometry;
    if (geometry.type != 'LineString') continue;
    createWaveWall(geometry.coordinates); 
}

if (map.getPitch() <= 5) {
    map.setPitch(60); // 如果没有倾斜，加个角度有效果
}

// 最后返回用于取消清空的函数
return {
    param: {
        threeContext,
        walls,
    },
    remove: (param) => {
        for(let c of param.walls) {
            c.stop();
            threeContext.remove(c)
        }
    }
}
`;
  editor.setValue(code);
};

export const threeButtons = [
  {
    name: "四棱锥",
    click: coneMesh
  },
  {
    name: "烟花效果",
    click: flyDot
  },
  {
    name: "径向渐变球",
    click: radialGradient
  },
  {
    name: "波动光圈",
    click: wave
  },
  {
    name: "雷达扫描",
    click: radar
  },
  {
    name: "波动光墙",
    click: waveWall
  },
  {
    name: "飞线效果",
    click: flyline
  },
  {
    name: "立体光墙",
    click: wall
  }
];
