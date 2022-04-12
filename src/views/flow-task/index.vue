<template>
  <div>
    <!-- 功能栏 -->
    <el-row :gutter="1" type="flex" justify="end">
      <el-button-group>
        <el-button>未开始</el-button>
        <el-button>进行中</el-button>
        <el-button>已完成</el-button>
      </el-button-group>
      <el-col
        :md="{ span: 3, offset: 0 }"
        :lg="{ span: 2, offset: 0 }"
        :xl="{ span: 2, offset: 0 }"
        class="hidden-sm-and-down white-background"
      >
        <el-button type="primary" @click="newFlow" size="default"
          >新建流程审批</el-button
        >
      </el-col>
    </el-row>
    <el-divider class="hidden-sm-and-down"></el-divider>
    <!-- 审批流程 -->
    <el-row>
      <div v-for="task in tasks" :key="task.id">
        <el-col
          :xs="24"
          :sm="24"
          :md="12"
          :lg="6"
          :xl="6"
          v-for="node in task.flowChart.nodes"
          :key="node.id"
          class="task-card"
        >
          <TaskCard :task="task" :node="node" />
        </el-col>
      </div>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref } from "vue";
import { TaskCard } from "/@/components/ReFlowTask";
import "element-plus/theme-chalk/display.css";
import { getTasks } from "/@/api/task";
import { ResultType } from "/@/store/modules/types";
import { storageLocal } from "/@/utils/storage";
const router = useRouter();
let tasks = ref([]);
const id = storageLocal.getItem("info").userInfo.id;
getTasks(id).then((data: ResultType) => {
  if (data.success) {
    tasks.value = data.data;
    console.log(tasks.value);
  }
});
function newFlow() {
  router.push("/newTask");
}
</script>

<style scoped>
.white-background {
  background-color: white;
}

.task-card {
  width: fit-content;
  height: fit-content;
}
</style>
