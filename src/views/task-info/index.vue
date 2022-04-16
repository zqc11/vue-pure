<template>
  <div>
    <el-row :gutter="6" id="toolbar" justify="start">
      <el-dropdown trigger="click" split-button @command="changeBlueprint">
        <span v-if="currentBlueprint == null">显示图纸</span>
        <span v-else>{{ currentBlueprint.filename }}</span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(blueprint, index) in blueprints"
              :key="index"
              :command="blueprint"
            >
              {{ blueprint.filename }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-col :xs="6" :sm="4" :md="3" :lg="2" :xl="2">
        <el-button class="top-menu-button" @click="showForm" :type="onlyForm"
          >仅显示表单</el-button
        >
      </el-col>
      <el-col :xs="6" :sm="4" :md="3" :lg="2" :xl="2">
        <el-button
          class="top-menu-button"
          @click="showBlueprint"
          :type="onlyBlueprint"
          >仅显示图纸</el-button
        >
      </el-col>
      <el-col
        :xs="6"
        :sm="4"
        :md="3"
        :lg="2"
        :xl="2"
        class="hidden-sm-and-down"
      >
        <el-button class="top-menu-button" @click="showAll" :type="both"
          >双列显示</el-button
        >
      </el-col>
      <el-col :xs="6" :sm="4" :md="3" :lg="2" :xl="2">
        <el-button
          type="danger"
          class="top-menu-button justify-end"
          :disabled="disabled"
          @click="approvalReject"
          >审批驳回</el-button
        >
      </el-col>
      <el-col :xs="6" :sm="4" :md="3" :lg="2" :xl="2">
        <el-button
          type="success"
          class="top-menu-button justify-end"
          :disabled="disabled"
          @click="approvalPass"
          >审批通过</el-button
        >
      </el-col>
    </el-row>
    <el-dialog v-model="dialogVisible" title="请选择驳回到的节点" width="30%">
      <el-steps :active="active - 1" align-center v-if="rejectNodes.length > 0">
        <el-step
          v-for="node in rejectNodes"
          :title="node.text.value"
          :key="node.id"
          @click="rejectToNode(node)"
        />
      </el-steps>
      <span v-else>暂无可选择的驳回节点</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="confirm"
            :disabled="rejectNodes.length === 0"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
    <TaskInfo />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, provide, ref } from "vue";
import { TaskInfo } from "/@/components/ReFlowTask";
import "element-plus/theme-chalk/display.css";
import { useOperationStoreHook } from "/@/store/modules/operation";
import { nodeUpdate } from "/@/api/task";
import { ResultType } from "/@/store/modules/types";
import { ElMessage } from "element-plus";
import { storageLocal } from "/@/utils/storage";

/* 变量定义 */
let show = ref(2);
const task = useOperationStoreHook().GET_CURRENT_TASK();
const node = ref(useOperationStoreHook().GET_CURRENT_NODE());
const currentOrderNum = ref(node.value.properties.orderNum);
const active = ref(currentOrderNum.value);
const rejectNodes = ref([]);
const blueprints = task.blueprints;
let currentBlueprint = ref(blueprints[0]);
const onlyForm = ref("");
const onlyBlueprint = ref("primary");
const both = ref("");
const userId = storageLocal.getItem("info").userInfo.id;
const dialogVisible = ref(false);
let disabled = computed(() => {
  return "进行中|被驳回".indexOf(node.value.properties.status) === -1;
});

/* 方法定义 */
// 显示表单信息
function showForm() {
  show.value = 1;
  onlyForm.value = "primary";
  onlyBlueprint.value = "";
  both.value = "";
}
// 显示机械图纸
function showBlueprint() {
  show.value = 2;
  onlyForm.value = "";
  onlyBlueprint.value = "primary";
  both.value = "";
}
// 两者都显示
function showAll() {
  show.value = 3;
  onlyForm.value = "";
  onlyBlueprint.value = "";
  both.value = "primary";
}

// 选择图纸
const changeBlueprint = command => {
  currentBlueprint.value = command;
  useOperationStoreHook().SET_CURRENT_BLUEPRINT(currentBlueprint.value);
};

// 审批驳回
const approvalReject = () => {
  dialogVisible.value = true;
};

// 审批通过
const approvalPass = () => {
  const data = {
    taskId: task.id,
    type: "审批通过",
    checker: userId,
    launchOrderNum: node.value.properties.orderNum,
    endOrderNum: node.value.properties.orderNum + 1
  };
  nodeUpdate(JSON.stringify(data))
    .then((response: ResultType) => {
      if (response.success) {
        node.value.properties.status = "已完成";
        ElMessage.success("提交成功");
      }
    })
    .catch(error => {
      ElMessage.error(error.message);
    });
};

const confirm = () => {
  const data = {
    taskId: task.id,
    type: "审批驳回",
    checker: userId,
    launchOrderNum: node.value.properties.orderNum,
    endOrderNum: active.value
  };
  nodeUpdate(JSON.stringify(data))
    .then((response: ResultType) => {
      if (response.success) {
        node.value.properties.status = "未开始";
        ElMessage.success("提交成功");
      }
    })
    .catch(error => {
      ElMessage.error(error.message);
    });
};

const rejectToNode = node => {
  active.value = node.properties.orderNum;
};

/* 方法调用 */
onMounted(() => {
  const edges = task.flowChart.edges;
  const nodes = task.flowChart.nodes;
  const targetNodeIds = edges
    .filter(edge => edge.sourceNodeId === node.value.id)
    .map(edge => edge.targetNodeId);
  rejectNodes.value = nodes.filter(
    node =>
      targetNodeIds.indexOf(node.id) !== -1 &&
      node.properties.orderNum < currentOrderNum.value
  );
  rejectNodes.value.sort(
    (a, b) => a.properties.orderNum - b.properties.orderNum
  );
});
useOperationStoreHook().SET_CURRENT_BLUEPRINT(currentBlueprint.value);
// 向TaskInfo传递props
provide("show", show);
provide("blueprint", currentBlueprint);
provide("disabled", disabled);
</script>

<style scoped>
.top-menu-button {
  width: 100%;
}

#toolbar {
  margin-bottom: 10px;
}

.margin-right {
  margin-right: 20px;
}

.justify-end {
  justify-self: flex-end;
}
</style>
