<template>
  <el-card @click="showInfo" shadow="hover" class="card">
    <template #header>
      <el-row>
        <el-col>
          <span>流程名称：</span>
          <span> {{ props.task.title }} </span>
        </el-col>
        <el-col>
          <span>所属节点：</span>
          <span>{{ props.node.text.value }}</span>
        </el-col>
      </el-row>
      <span> {{}}</span>
    </template>
    <img src="./assets/cad.jpg" alt="机械图纸" />
    <el-row>
      <el-col>
        <span>进度：</span>
        <el-tag :type="type" effect="dark">{{ status }}</el-tag>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useOperationStoreHook } from "/@/store/modules/operation";

const router = useRouter();
const props = defineProps({
  task: {
    type: Object
  },
  node: {
    type: Object
  }
});
const status = computed(() => {
  return props.node.properties.status;
});
const type = computed(() => {
  if (status.value === "被驳回") {
    return "danger";
  } else if (status.value === "已完成") {
    return "success";
  } else if (status.value === "进行中") {
    return "warning";
  }
  return "";
});
function showInfo() {
  useOperationStoreHook().SET_CURRENT_TASK(props.task);
  useOperationStoreHook().SET_CURRENT_NODE(props.node);
  router.push("/taskinfo");
}
</script>

<style scoped>
.card {
  margin: 5px;
}
</style>
