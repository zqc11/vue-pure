<script setup lang="ts">
import { ref, unref, onMounted, provide } from "vue";
import { LogicFlow, BaseNodeModel } from "@logicflow/core";
import { Snapshot, BpmnElement, Menu } from "@logicflow/extension";
import "@logicflow/core/dist/style/index.css";
import "@logicflow/extension/lib/style/index.css";
import {
  Control,
  NodePanel,
  DataDialog,
  NodeDrawer
  // EdgeDrawer
} from "/@/components/ReFlowChart";
import { toLogicflowData } from "/@/components/ReFlowChart/src/adpterForTurbo";
import { BpmnNode } from "/@/components/ReFlowChart/src/config";
import demoData from "./dataTurbo.json";

// "@logicflow/core": "0.7.1",
// "@logicflow/extension": "0.7.1",

// logicflow实例
let lf = ref<LogicFlow>(null);
let graphData = ref(null);
let dataVisible = ref<boolean>(false);
let openDrawer = ref(false);
let selectedNode = ref<BaseNodeModel>(null);
// const props = withDefaults(defineProps<Props>(), {
//   formData: null
// });
let config = ref({
  // 打开网格
  grid: true,
  textEdit: false,
  // 禁止鼠标滚轮上下移动画布
  stopScrollGraph: true,
  background: {
    color: "#f7f9ff"
  },
  keyboard: {
    enabled: true,
    // 自定义快捷键
    shortcuts: [
      {
        keys: ["delete"],
        callback: () => {
          const element = unref(lf).getSelectElements(true);
          unref(lf).clearSelectElements();
          element.edges.forEach(edge => {
            unref(lf).deleteEdge(edge.id);
          });
          element.nodes.forEach(node => {
            unref(lf).deleteNode(node.id);
          });
        }
      }
    ]
  }
});

let nodeList = BpmnNode;

function initLf() {
  // 画布配置
  LogicFlow.use(Snapshot);
  // 使用bpmn插件，引入bpmn元素，这些元素可以在turbo中转换后使用
  LogicFlow.use(BpmnElement);
  // 启动右键菜单
  LogicFlow.use(Menu);
  // 新建logicflow对象
  const domLf = new LogicFlow({
    ...unref(config),
    container: document.querySelector("#LF-Turbo")
  });
  lf.value = domLf;
  // 设置边类型bpmn:sequenceFlow为默认类型
  unref(lf).setDefaultEdgeType("bpmn:sequenceFlow");
  onRender();
}

function onRender() {
  // Turbo数据转换为LogicFlow内部识别的数据结构
  const lFData = toLogicflowData(demoData);
  lf.value.render(lFData);
}

function catData() {
  graphData.value = unref(lf).getGraphData();
  dataVisible.value = true;
}
function onBindEvent() {
  unref(lf).on("node:dbclick, edge:dbclick", data => {
    console.log(data);
    selectedNode.value = lf.value.getNodeModelById(data.data.id);
    openDrawer.value = true;
  });
  window.addEventListener("mousewheel", zoom, false);
}
function zoom(event) {
  if (event.deltaY > 0) {
    unref(lf).zoom();
  } else {
    unref(lf).zoom(true);
  }
  // 防止事件冒泡
  event.stopPropagation();
}
onMounted(() => {
  initLf();
  onBindEvent();
});
provide("openDrawer", openDrawer);
provide("selectedNode", selectedNode);
</script>

<template>
  <div class="logic-flow-view">
    <!-- 辅助工具栏 -->
    <Control
      class="demo-control"
      v-if="lf"
      :lf="lf"
      :catTurboData="false"
      @catData="catData"
    ></Control>
    <!-- 节点面板 -->
    <NodePanel :lf="lf" :nodeList="nodeList"></NodePanel>
    <!-- 画布 -->
    <div id="LF-Turbo"></div>
    <!-- 节点/边缘抽屉信息 -->
    <node-drawer />
    <!-- 数据查看面板 -->
    <el-dialog
      customClass="flow-dialog"
      title="数据"
      v-model="dataVisible"
      width="50%"
    >
      <el-scrollbar>
        <DataDialog :graphData="graphData"></DataDialog>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<style scoped>
#LF-Turbo {
  width: 100%;
  height: calc(100vh - 90px);
}

.logic-flow-view {
  margin: 10px;
  position: relative;
}

.demo-title {
  text-align: center;
  margin: 20px;
}

.demo-control {
  position: absolute;
  top: 10px;
  right: 20px;
  z-index: 2;
}

.time-plus {
  cursor: pointer;
}

.add-panel {
  position: absolute;
  z-index: 11;
  background-color: white;
  padding: 10px 5px;
}

.el-drawer__body {
  height: 80%;
  overflow: auto;
  margin-top: -30px;
  z-index: 3;
}

:deep(.flow-dialog) {
  transform: none;
  left: 0;
  top: 5vh;
  position: relative;
  margin: 0 auto;
}

:deep(.flow-dialog) .el-dialog__body {
  height: 85vh;
  overflow: auto;
}

.main-content {
  margin: 0;
}
</style>