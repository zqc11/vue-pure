<template>
  <div>
    <!-- 功能栏 -->
    <div class="white-background">
      <el-row :gutter="1" type="flex" justify="end">
        <el-col :span="1">
          <el-button size="small" type="primary" @click="newFlow"
            >新建流程审批</el-button
          >
        </el-col>
      </el-row>
    </div>
    <el-divider></el-divider>
    <!-- 审批流程 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="t in data" :key="t.id" class="task-card">
        <TaskCard :item="t" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref } from "vue";
import { TaskCard } from "/@/components/ReFlowTask";
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
  router.push("/newTask/index");
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
