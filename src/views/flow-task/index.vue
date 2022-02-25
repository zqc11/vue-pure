<template>
  <div>
    <!-- 功能栏 -->
    <el-row :gutter="1" type="flex" justify="end">
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
    <el-row :gutter="20">
      <el-col
        :xs="24"
        :sm="24"
        :md="12"
        :lg="6"
        :xl="6"
        v-for="t in data"
        :key="t.id"
        class="task-card"
      >
        <TaskCard :item="t" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref } from "vue";
import { TaskCard } from "/@/components/ReFlowTask";
import "element-plus/theme-chalk/display.css";
const router = useRouter();
let data = ref([
  {
    id: 1,
    title: "1号图纸"
  },
  {
    id: 3,
    title: "3号图纸"
  },
  {
    id: 2,
    title: "2号图纸"
  },
  {
    id: 4,
    title: "4号图纸"
  },
  {
    id: 5,
    title: "5号图纸"
  }
]);
function newFlow() {
  router.push("/newTask");
}
</script>

<style scoped>
.white-background {
  background-color: white;
}

.task-card {
  background-color: white;
  width: fit-content;
  height: fit-content;
}
</style>
