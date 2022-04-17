<template>
  <el-dialog
    v-model="dialogTableVisible"
    title="流程模板"
    @close="handleClose"
    destroy-on-close
  >
    <el-scrollbar height="50vh">
      <el-card
        v-for="template in templates"
        :key="template.id"
        class="item-card"
      >
        <template #header>
          <div class="item-container">
            <span>{{ template.title }}</span>
            <el-button type="primary" @click="loadFlowChartJson(template.json)"
              >加载</el-button
            >
          </div>
        </template>
        <div>描述：{{ template.description }}</div>
        <div>创建人: {{ template.creator.name }}</div>
      </el-card>
    </el-scrollbar>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { inject, ref, Ref, watch } from "vue";
import { getFlowTemplate } from "/@/api/task";
import { ResultType } from "/@/store/modules/types";

/* 变量定义 */
const dialogTableVisible = inject<Ref>("dialogTableVisible");
const templates = ref([]);
const emitter = defineEmits(["loadFlowChartJson"]);

/* 方法定义 */
const handleClose = () => {
  dialogTableVisible.value = false;
};

const loadFlowChartJson = json => {
  emitter("loadFlowChartJson", JSON.parse(json));
  ElMessage.success("加载成功");
  dialogTableVisible.value = false;
};

/* 方法调用 */
watch(dialogTableVisible, () => {
  getFlowTemplate().then((response: ResultType) => {
    if (response.success) {
      templates.value = response.data;
    }
  });
});
</script>

<style scoped>
.item-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: --el-box-shadow;
}

.item-card {
  margin-top: 20px;
}
</style>
