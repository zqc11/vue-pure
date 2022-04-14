/* eslint-disable no-redeclare */ /* eslint-disable no-redeclare */
<template>
  <div class="btmcenter">
    <el-button-group>
      <el-button size="small" @click="draw('arrow')">绘制箭头</el-button>
      <el-button size="small" @click="draw('freedraw')">随手绘制</el-button>
      <el-button size="small" @click="draw('line')">直线</el-button>
      <el-button size="small" @click="draw('dottedline')">虚线</el-button>
      <el-button size="small" @click="draw('circle')">圆</el-button>
      <el-button size="small" @click="draw('ellipse')">椭圆</el-button>
      <el-button size="small" @click="draw('rectangle')">矩形</el-button>
      <el-button size="small" @click="draw('rightangle')">直角三角形</el-button>
      <el-button size="small" @click="draw('equilateral')"
        >等边三角形</el-button
      >
      <el-button size="small" @click="draw('text')">文本</el-button>
      <el-button size="small" @click="selectDel()">删除选择</el-button>
      <el-dropdown
        split-button
        size="small"
        @command="cmd => (strokeWidth = +cmd)"
      >
        线宽
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="i in 10" :key="i" :command="i">{{
              i
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-color-picker v-model="strokeColor" size="small" />
    </el-button-group>
    <el-button-group>
      <el-button type="primary" @click="confirmOk()" size="small"
        >保存批注</el-button
      >
      <el-button type="info" @click="gobackFree()" size="small">取消</el-button>
    </el-button-group>
  </div>
</template>

<script setup>
import { fabric } from "fabric";
import { inject, ref, nextTick, onUnmounted } from "vue";
import vjmap from "vjmap";
import { emitter, getInput } from "/@/utils/ui/ui";
import { useAppStore } from "/@/store/modules/vjmap/app";
import { waitSourceLoaded, createDivSvg } from "/@/utils/ui/map";
/* 变量定义 */
const app = useAppStore();
const map = inject("map")();
let svc = map.getService();
const strokeColor = ref("#e34f51");
const strokeWidth = ref(5);
let drawCanvas;
let fabricCanvas;
let canvasCoord1, canvasCoord2;
let canvasWidth, canvasHeight;
let drawType;
let id = "";
let curEditItem; // 当前编辑项

/* 方法定义 */
const beginFreeDraw = () => {
  if (drawCanvas) {
    return;
  }

  // 先使地图不要放置倾斜
  map.setPitch(0);
  map.setBearing(0);

  let mapCanvas = map.getCanvas();
  drawCanvas = document.createElement("canvas");
  drawCanvas.style.position = "absolute";
  let rect = mapCanvas.getBoundingClientRect();
  drawCanvas.style.left = rect.left + "px";
  drawCanvas.style.top = rect.top + "px";
  drawCanvas.style.width = rect.width + "px";
  drawCanvas.style.height = rect.height + "px";
  insertAfter(drawCanvas, mapCanvas.parentNode);
  canvasWidth = rect.width;
  canvasHeight = rect.height;
  initFabric(drawCanvas, canvasWidth, canvasHeight);
  canvasCoord1 = map.fromLngLat(map.unproject(new vjmap.Point(0, 0)));
  canvasCoord2 = map.fromLngLat(
    map.unproject(new vjmap.Point(canvasWidth, canvasHeight))
  );
};

const insertAfter = (newElement, targetElement) => {
  var parent = targetElement.parentNode;
  if (parent.lastChild == targetElement) {
    parent.appendChild(newElement);
  } else {
    parent.insertBefore(newElement, targetElement.nextSibling);
  }
};

const initFabric = (drawCanvas, width, height) => {
  let canvas = new fabric.Canvas(drawCanvas, {
    isDrawingMode: false,
    selectable: true,
    selection: true,
    width: width,
    height: height
  });

  fabricCanvas = canvas;
  //
  //变量声明
  let mouseFrom = {},
    mouseTo = {},
    textbox = null;
  let drawingObject = null; //当前绘制对象
  let moveCount = 1; //绘制移动计数器
  let doDrawing = false; // 绘制状态

  canvas.freeDrawingBrush.color = strokeColor.value; //设置自由绘颜色
  canvas.freeDrawingBrush.width = strokeWidth.value;

  //绑定画板事件
  canvas.on("mouse:down", function (options) {
    if (fabricCanvas.selection) return;
    mouseFrom.x = options.e.offsetX;
    mouseFrom.y = options.e.offsetY;
    doDrawing = true;
  });
  canvas.on("mouse:up", function (options) {
    if (fabricCanvas.selection) return;
    mouseTo.x = options.e.offsetX;
    mouseTo.y = options.e.offsetY;
    // drawing();
    if (drawingObject) {
      fabricCanvas.setActiveObject(drawingObject);
      fabricCanvas.requestRenderAll();
    }

    drawingObject = null;
    moveCount = 1;
    doDrawing = false;
    fabricCanvas.isDrawingMode = false;
    fabricCanvas.selection = true;
  });
  canvas.on("mouse:move", function (options) {
    if (fabricCanvas.selection) return;
    if (moveCount % 2 && !doDrawing) {
      //减少绘制频率
      return;
    }
    moveCount++;
    mouseTo.x = options.e.offsetX;
    mouseTo.y = options.e.offsetY;
    drawing();
  });

  //绘画方法
  function drawing() {
    if (drawingObject) {
      canvas.remove(drawingObject);
    }
    var canvasObject = null;
    switch (drawType) {
      case "arrow": //箭头
        canvasObject = new fabric.Path(
          drawArrow(mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y, 30, 30),
          {
            stroke: strokeColor.value,
            fill: "rgba(255,255,255,0)",
            strokeWidth: strokeWidth.value
          }
        );
        break;
      case "line": //直线
        canvasObject = new fabric.Line(
          [mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y],
          {
            stroke: strokeColor.value,
            strokeWidth: strokeWidth.value
          }
        );
        break;
      case "dottedline": //虚线
        canvasObject = new fabric.Line(
          [mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y],
          {
            strokeDashArray: [3, 1],
            stroke: strokeColor.value,
            strokeWidth: strokeWidth.value
          }
        );
        break;
      case "circle": //正圆
        var left = mouseFrom.x,
          top = mouseFrom.y;
        var radius =
          Math.sqrt(
            (mouseTo.x - left) * (mouseTo.x - left) +
              (mouseTo.y - top) * (mouseTo.y - top)
          ) / 2;
        canvasObject = new fabric.Circle({
          left: left,
          top: top,
          stroke: strokeColor.value,
          fill: "rgba(255, 255, 255, 0)",
          radius: radius,
          strokeWidth: strokeWidth.value
        });
        break;
      case "ellipse": //椭圆
        // eslint-disable-next-line no-redeclare
        var left = mouseFrom.x,
          // eslint-disable-next-line no-redeclare
          top = mouseFrom.y;
        // eslint-disable-next-line no-redeclare
        var radius =
          Math.sqrt(
            (mouseTo.x - left) * (mouseTo.x - left) +
              (mouseTo.y - top) * (mouseTo.y - top)
          ) / 2;
        canvasObject = new fabric.Ellipse({
          left: left,
          top: top,
          stroke: strokeColor.value,
          fill: "rgba(255, 255, 255, 0)",
          originX: "center",
          originY: "center",
          rx: Math.abs(left - mouseTo.x),
          ry: Math.abs(top - mouseTo.y),
          strokeWidth: strokeWidth.value
        });
        break;
      case "rectangle": //长方形
        var path =
          "M " +
          mouseFrom.x +
          " " +
          mouseFrom.y +
          " L " +
          mouseTo.x +
          " " +
          mouseFrom.y +
          " L " +
          mouseTo.x +
          " " +
          mouseTo.y +
          " L " +
          mouseFrom.x +
          " " +
          mouseTo.y +
          " L " +
          mouseFrom.x +
          " " +
          mouseFrom.y +
          " z";
        canvasObject = new fabric.Path(path, {
          left: left,
          top: top,
          stroke: strokeColor.value,
          strokeWidth: strokeWidth.value,
          fill: "rgba(255, 255, 255, 0)"
        });
        //也可以使用fabric.Rect
        break;
      case "rightangle": //直角三角形
        // eslint-disable-next-line no-redeclare
        var path =
          "M " +
          mouseFrom.x +
          " " +
          mouseFrom.y +
          " L " +
          mouseFrom.x +
          " " +
          mouseTo.y +
          " L " +
          mouseTo.x +
          " " +
          mouseTo.y +
          " z";
        canvasObject = new fabric.Path(path, {
          left: left,
          top: top,
          stroke: strokeColor.value,
          strokeWidth: strokeWidth.value,
          fill: "rgba(255, 255, 255, 0)"
        });
        break;
      case "equilateral": //等边三角形
        var height = mouseTo.y - mouseFrom.y;
        canvasObject = new fabric.Triangle({
          top: mouseFrom.y,
          left: mouseFrom.x,
          width: Math.sqrt(Math.pow(height, 2) + Math.pow(height / 2.0, 2)),
          height: height,
          stroke: strokeColor.value,
          strokeWidth: strokeWidth.value,
          fill: "rgba(255,255,255,0)"
        });
        break;
      case "text":
        textbox = new fabric.Textbox("", {
          left: mouseFrom.x - 60,
          top: mouseFrom.y - 20,
          width: 150,
          fontSize: 30,
          borderColor: "yellow",
          fill: strokeColor.value,
          hasControls: true
        });
        canvas.add(textbox);
        textbox.enterEditing();
        textbox.hiddenTextarea.focus();
        break;
      case "remove":
        break;
      default:
        break;
    }
    if (canvasObject) {
      canvas.add(canvasObject);
      drawingObject = canvasObject;
    }
  }

  //绘制箭头方法
  function drawArrow(fromX, fromY, toX, toY, theta, headlen) {
    theta = typeof theta != "undefined" ? theta : 30;
    headlen = typeof theta != "undefined" ? headlen : 10;
    // 计算各角度和对应的P2,P3坐标
    var angle = (Math.atan2(fromY - toY, fromX - toX) * 180) / Math.PI,
      angle1 = ((angle + theta) * Math.PI) / 180,
      angle2 = ((angle - theta) * Math.PI) / 180,
      topX = headlen * Math.cos(angle1),
      topY = headlen * Math.sin(angle1),
      botX = headlen * Math.cos(angle2),
      botY = headlen * Math.sin(angle2);
    var arrowX = fromX - topX,
      arrowY = fromY - topY;
    var path = " M " + fromX + " " + fromY;
    path += " L " + toX + " " + toY;
    arrowX = toX + topX;
    arrowY = toY + topY;
    path += " M " + arrowX + " " + arrowY;
    path += " L " + toX + " " + toY;
    arrowX = toX + botX;
    arrowY = toY + botY;
    path += " L " + arrowX + " " + arrowY;
    return path;
  }
};

const draw = dType => {
  beginFreeDraw();
  if (dType == "freedraw") {
    fabricCanvas.freeDrawingBrush.color = strokeColor.value; //设置自由绘颜色
    fabricCanvas.freeDrawingBrush.width = strokeWidth.value;
    fabricCanvas.isDrawingMode = true;
  } else {
    fabricCanvas.isDrawingMode = false;
  }
  fabricCanvas.selection = false;
  drawType = dType;
};

const selectDel = () => {
  var selected = fabricCanvas.getActiveObjects(),
    selGroup = new fabric.ActiveSelection(selected, {
      canvas: fabricCanvas
    });
  if (!selGroup) return;

  selGroup.forEachObject(function (obj) {
    fabricCanvas.remove(obj);
  });
  fabricCanvas.discardActiveObject().renderAll();
};

const createDivCanvas = (p1, p2, canvas, id) => {
  id = id ?? "canvasid_" + vjmap.RandomID();
  let lngLat1 = map.toLngLat(p1);
  let lngLat2 = map.toLngLat(p2);
  let pt1 = new vjmap.GeoPoint(),
    pt2 = new vjmap.GeoPoint();
  pt1.x = lngLat1[0];
  pt1.y = lngLat1[1];
  pt2.x = lngLat2[0];
  pt2.y = lngLat2[1];
  map.addSource(id + "_source", {
    type: "canvas",
    canvas: canvas,
    coordinates: [
      [pt1.x, pt1.y],
      [pt2.x, pt1.y],
      [pt2.x, pt2.y],
      [pt1.x, pt2.y]
    ]
  });
  map.addRasterLayer(id + +"_layer", id + "_source", {
    visibility: "visible"
  });
  return id;
};

const endFreeDraw = () => {
  if (!canvasCoord1) return;
  if (drawCanvas) {
    map.getCanvas().parentNode.parentNode.removeChild(drawCanvas.parentElement);
    drawCanvas = null;
  }
};
const confirmOk = async () => {
  try {
    let name = await getInput("批注", "请输入批注内容", curEditItem?.name);
    id = createDivCanvas(
      canvasCoord1,
      canvasCoord2,
      drawCanvas,
      curEditItem?.id
    );
    await waitSourceLoaded(map, id + "_source");
    // let img = await takeScreenshot(map, 300);
    let center = map.getCenter();
    let anno = {
      mapId: app.curMapId,
      version: app.curVersion,
      name: name,
      darkTheme: svc.currentMapParam()?.darkMode === true ? true : false,
      // imgSrc: img,
      zoom: map.getZoom(),
      centerX: center.lng,
      centerY: center.lat,
      bearing: map.getBearing(),
      pitch: map.getPitch(),
      id: id,
      pt1: canvasCoord1,
      pt2: canvasCoord2,
      width: canvasWidth,
      height: canvasHeight,
      svg: fabricCanvas.toSVG(),
      json: fabricCanvas.toJSON()
    };
    app.saveAnnotataion(anno);
    // canvas图层只是用于截图，最后退出时清空了
    if (id) map.removeSourceEx(id + "_source");
    // 增加divSvg
    let divOverlay = createDivSvg(
      map,
      id,
      canvasCoord1,
      canvasCoord2,
      canvasWidth,
      canvasHeight,
      anno.svg
    );
    app.annoIdDivOverlay[id] = divOverlay;
    await gobackFree();
  } catch (error) {
    if (id) map.removeSourceEx(id + "_source");
    console.warn(error);
  }
};

const gobackFree = async () => {
  endFreeDraw();
  emitter.emit("changeUiAction", "free");
  await nextTick();
  emitter.emit("activeSideBarTabs", {
    name: "Annotation"
  });
};

const loadAnnotataion = item => {
  // 加载编辑
  curEditItem = item; // 用编辑的id
  if (fabricCanvas) {
    fabricCanvas.loadFromJSON(item.json, function () {
      fabricCanvas.renderAll();
    });
  }
};

/* 方法调用 */
beginFreeDraw();
emitter.on("loadAnnotataion", loadAnnotataion);
onUnmounted(() => emitter.off("loadAnnotataion", loadAnnotataion));
</script>

<style scoped lang="scss">
.righttop {
  position: absolute;
  right: 2px;
  margin: 5px;
}

.left-top {
  height: 100%;
  position: absolute;
  display: flex;
  flex-flow: row nowrap;
  left: 5px;
}

.btmcenter {
  width: 100%;
  position: absolute;
  top: 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>
