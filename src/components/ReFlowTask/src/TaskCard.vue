<template>
  <el-card @click="showInfo(props.task)" shadow="hover" class="card">
    <template #header>
      <span>
        {{ props.task.title }}
      </span>
    </template>
    <img src="./assets/cad.jpg" alt="机械图纸" />
  </el-card>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useOperationStoreHook } from "/@/store/modules/operation";

const router = useRouter();
const props = defineProps({
  task: {
    type: Object
  }
});
function showInfo(t) {
  useOperationStoreHook().SET_CURRENT_TASK(t);
  router.push("/taskinfo");
}
</script>

<style scoped>
.card {
  margin: 5px;
}
</style>
