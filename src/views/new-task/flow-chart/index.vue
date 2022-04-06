<script setup lang="ts">
import { ref, unref, onMounted, provide } from "vue";
import { LogicFlow, BaseNodeModel, BaseEdgeModel } from "@logicflow/core";
import { Snapshot, BpmnElement, Menu } from "@logicflow/extension";
import { useRouter } from "vue-router";
import "@logicflow/core/dist/style/index.css";
import "@logicflow/extension/lib/style/index.css";
import {
  Control,
  NodePanel,
  DataDialog,
  NodeDrawer,
  EdgeDrawer
} from "/@/components/ReFlowChart";
import { BpmnNode } from "/@/components/ReFlowChart/src/config";
import logicFlowData from "./logicFlowData.json";
import { ElMessage } from "element-plus";
import { useFlowTaskStoreHook } from "/@/store/modules/flowTask";

// logicflow实例
const router = useRouter();
let lf = ref<LogicFlow>(null);
let graphData = ref(null);
let dataVisible = ref<boolean>(false);
let openNodeDrawer = ref(false);
let openEdgeDrawer = ref(false);
let selectedNode = ref<BaseNodeModel>(null);
let selectedEdge = ref<BaseEdgeModel>(null);
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
const emit = defineEmits(["next"]);
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
  lf.value.render(logicFlowData);
}

function catData() {
  graphData.value = unref(lf).getGraphData();
  dataVisible.value = true;
}
function onBindEvent() {
  unref(lf).on("node:dbclick, edge:dbclick", data => {
    let type = data.data.type;
    if (type === "bpmn:startEvent" || type === "bpmn:endEvent") return;
    if (type != "bpmn:sequenceFlow") {
      selectedNode.value = lf.value.getNodeModelById(data.data.id);
      openNodeDrawer.value = true;
    } else {
      selectedEdge.value = lf.value.getEdgeModelById(data.data.id);
      openEdgeDrawer.value = true;
    }
  });
  window.addEventListener("mousewheel", zoom, false);
}

// 缩放事件
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
function next() {
  const data = lf.value.getGraphData();
  for (let i in data.nodes) {
    const node = data.nodes[i];
    const type = node.type;
    const notStartOrEnd =
      type !== "bpmn:startEvent" && type !== "bpmn:endEvent";
    if (notStartOrEnd && node.properties.checkers.length === 0) {
      ElMessage.error("节点 " + node.text.value + " 未设置审批人");
      return;
    }
  }
  useFlowTaskStoreHook().setFlowChart(data);
  emit("next", 4);
  router.push("/newTask/permission");
}
provide("openNodeDrawer", openNodeDrawer);
provide("openEdgeDrawer", openEdgeDrawer);
provide("selectedNode", selectedNode);
provide("selectedEdge", selectedEdge);
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
      @next="next"
    ></Control>
    <!-- 节点面板 -->
    <NodePanel :lf="lf" :nodeList="nodeList"></NodePanel>
    <!-- 画布 -->
    <div id="LF-Turbo"></div>
    <!-- 节点/边缘抽屉信息 -->
    <node-drawer v-if="openNodeDrawer" />
    <edge-drawer v-if="openEdgeDrawer" />
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
