<script setup lang="ts">
import { ref, unref, onMounted, provide, reactive } from "vue";
import { LogicFlow, BaseNodeModel, BaseEdgeModel } from "@logicflow/core";
import { Snapshot, BpmnElement, Menu } from "@logicflow/extension";
import { BpmnNode } from "/@/components/ReFlowChart/src/config";
import "@logicflow/core/dist/style/index.css";
import "@logicflow/extension/lib/style/index.css";
import { useFlowTaskStoreHook } from "/@/store/modules/flowTask";
import {
  Control,
  NodePanel,
  DataDialog,
  NodeDrawer,
  EdgeDrawer
} from "/@/components/ReFlowChart";
import { saveFlowTemplate } from "/@/api/task";
import { ResultType } from "/@/store/modules/types";
import { storageLocal } from "/@/utils/storage";
import { ElMessage } from "element-plus";

/* 变量定义 */
const logicFlowData = {};
const dialogTableVisible = ref(false);
const formRef = ref();
const templateForm = reactive({
  title: "",
  description: ""
});
// logicflow实例
let lf = ref<LogicFlow>(null);
let graphData = ref(null);
let dataVisible = ref<boolean>(false);
let openNodeDrawer = ref(false);
let openEdgeDrawer = ref(false);
let selectedNode = ref<BaseNodeModel>(null);
let selectedEdge = ref<BaseEdgeModel>(null);
// logicflow实例配置
let config = ref({
  // 打开网格
  grid: true,
  textEdit: false,
  // 禁止鼠标滚轮上下移动画布
  stopScrollGraph: true,
  // 背景颜色
  background: {
    color: "#f7f9ff"
  },
  // 绑定快捷键
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

/* 方法定义 */
// 初始化logicflow实例
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

// 展示流程json数据弹窗
function catData() {
  graphData.value = unref(lf).getGraphData();
  dataVisible.value = true;
}

function onBindEvent() {
  unref(lf).on("node:dbclick, edge:dbclick", data => {
    let type = data.data.type;
    if (type != "bpmn:sequenceFlow") {
      selectedNode.value = lf.value.getNodeModelById(data.data.id);
      openNodeDrawer.value = true;
    } else {
      selectedEdge.value = lf.value.getEdgeModelById(data.data.id);
      openEdgeDrawer.value = true;
    }
  });
}

// 下一步
function next() {
  const data = lf.value.getGraphData();
  useFlowTaskStoreHook().setFlowChart(data);
}

const loadFlowChartJson = json => {
  lf.value.render(json);
};

const saveTemplate = () => {
  dialogTableVisible.value = true;
};

const confirm = async formRefEl => {
  if (!formRefEl) return;
  await formRefEl.validate(valid => {
    if (valid) {
      const data = {
        title: templateForm.title,
        description: templateForm.description,
        creatorId: storageLocal.getItem("info").userInfo.id,
        json: JSON.stringify(unref(lf).getGraphData()),
        maintain: []
      };
      saveFlowTemplate(data).then((response: ResultType) => {
        if (response.success) {
          dialogTableVisible.value = false;
          formRefEl.resetFields();
          ElMessage.success("提交成功");
        }
      });
    }
  });
};

const cancel = formRefEl => {
  dialogTableVisible.value = false;
  if (!formRefEl) return;
  formRefEl.resetFields();
};

/* 方法调用 */
onMounted(() => {
  initLf();
  onBindEvent();
});
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
    >
      <template #right>
        <el-button type="primary" size="small" @click="saveTemplate"
          >保存模板</el-button
        >
      </template>
    </Control>
    <el-dialog
      v-model="dialogTableVisible"
      title="流程模板信息"
      width="40%"
      center
    >
      <el-form
        ref="formRef"
        label-position="top"
        label-width="100px"
        :model="templateForm"
        style="max-width: 460px"
      >
        <el-form-item label="流程模板名称" required>
          <el-input v-model="templateForm.title" />
        </el-form-item>
        <el-form-item label="流程模板描述">
          <el-input v-model="templateForm.description" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="confirm(formRef)">提交</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 节点面板 -->
    <NodePanel
      :lf="lf"
      :nodeList="nodeList"
      @loadFlowChartJson="loadFlowChartJson"
    ></NodePanel>
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
  right: 40px;
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
