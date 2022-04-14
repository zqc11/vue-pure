<template>
  <div>
    <Splitpanes class="default-theme">
      <Pane v-show="showForm()" :size="width" :min-size="minSizeOfForm">
        <!-- 显示表单信息 -->
        <el-scrollbar height="80vh">
          <div class="form-container">
            <v-form-render
              :form-json="formJson"
              :form-data="formData"
              :option-data="optionData"
              ref="vFormRef"
            >
            </v-form-render>
            <el-button type="primary" @click="submitForm">保存</el-button>
          </div>
        </el-scrollbar>
      </Pane>
      <Pane
        v-show="showBlueprint()"
        :size="width"
        :min-size="minSizeOfBlueprint"
      >
        <el-scrollbar height="80vh">
          <!-- 显示机械图纸 -->
          <MapContainer v-if="type === 'dwg'"></MapContainer>
          <PdfView v-else-if="type === 'pdf'"></PdfView>
        </el-scrollbar>
      </Pane>
    </Splitpanes>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, Ref, ref, reactive } from "vue";
import { PdfView } from "/@/components/ReFlowTask";
import { MapContainer } from "/@/components/ReMap";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import { ElMessage } from "element-plus";
import { useOperationStoreHook } from "/@/store/modules/operation";
import { saveFormData } from "/@/api/task";
import { ResultType } from "/@/store/modules/types";

/* 变量定义 */
const task = useOperationStoreHook().GET_CURRENT_TASK();
let show = inject<Ref>("show");
let blueprint = inject<Ref>("blueprint");
const formJson = reactive(JSON.parse(task.formJson));
const formData = reactive(JSON.parse(task.formData ? task.formData : "{}"));
const optionData = reactive({});
const vFormRef = ref(null);
let width = computed(() => {
  if (show.value == 1 || show.value == 2) {
    return 100;
  }
  return 50;
});
let type = computed(() => {
  if (blueprint.value.filename) {
    const isDwg = blueprint.value.filename.endsWith(".dwg");
    if (isDwg) {
      return "dwg";
    } else {
      return "pdf";
    }
  }
  return "";
});

/* 方法定义 */
function showForm() {
  return show.value != 2;
}
function showBlueprint() {
  return show.value != 1;
}
let minSizeOfForm = computed(() => {
  if (show.value == 1) {
    return 100;
  }
  if (show.value == 2) {
    return 0;
  }
  return 20;
});
let minSizeOfBlueprint = computed(() => {
  if (show.value == 1) {
    return 0;
  }
  if (show.value == 2) {
    return 100;
  }
  return 20;
});

const submitForm = () => {
  vFormRef.value
    .getFormData()
    .then(formData => {
      // Form Validation OK
      saveFormData({ id: task.id, formData: JSON.stringify(formData) }).then(
        (response: ResultType) => {
          if (response.success) {
            ElMessage.success("保存成功");
          }
        }
      );
    })
    .catch(error => {
      // Form Validation failed
      ElMessage.error(error);
    });
};
</script>

<style>
.splitpanes.default-theme .splitpanes__splitter {
  background-color: #fff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
  -ms-flex-negative: 0;
  flex-shrink: 0;
}

.default-theme.splitpanes--vertical > .splitpanes__splitter,
.default-theme .splitpanes--vertical > .splitpanes__splitter {
  width: 15px;
  border-left: 2px solid #bbb;
  margin-left: -1px;
}

.form-container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}
</style>
