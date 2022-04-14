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
        <el-button type="danger" class="top-menu-button justify-end"
          >审批驳回</el-button
        >
      </el-col>
      <el-col :xs="6" :sm="4" :md="3" :lg="2" :xl="2">
        <el-button type="success" class="top-menu-button justify-end"
          >审批通过</el-button
        >
      </el-col>
    </el-row>
    <TaskInfo />
  </div>
</template>

<script setup lang="ts">
import { provide, ref } from "vue";
import { TaskInfo } from "/@/components/ReFlowTask";
import "element-plus/theme-chalk/display.css";
import { useOperationStoreHook } from "/@/store/modules/operation";

/* 变量定义 */
let show = ref(2);
const task = useOperationStoreHook().GET_CURRENT_TASK();
const blueprints = task.blueprints;
let currentBlueprint = ref(blueprints[0]);
const onlyForm = ref("");
const onlyBlueprint = ref("primary");
const both = ref("");

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

/* 方法调用 */
useOperationStoreHook().SET_CURRENT_BLUEPRINT(currentBlueprint.value);
// 向TaskInfo传递props
provide("show", show);
provide("blueprint", currentBlueprint);
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
