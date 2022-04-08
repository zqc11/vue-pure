<template>
  <div>
    <Splitpanes class="default-theme">
      <Pane v-show="showForm()" :size="width" :min-size="minSizeOfForm">
        <!-- 显示表单信息 -->
        <el-scrollbar height="80vh">
          <v-form-render
            :form-json="formJson"
            :form-data="formData"
            :option-data="optionData"
            ref="vFormRef"
          >
          </v-form-render>
          <el-button type="primary" @click="submitForm">Submit</el-button>
        </el-scrollbar>
      </Pane>
      <Pane
        v-show="showBlueprint()"
        :size="width"
        :min-size="minSizeOfBlueprint"
      >
        <el-scrollbar height="80vh">
          <!-- 显示机械图纸 -->
          <Blueprint v-if="type === 'dwg'"></Blueprint>
          <PdfView v-else-if="type === 'pdf'"></PdfView>
        </el-scrollbar>
      </Pane>
    </Splitpanes>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, Ref, ref, reactive } from "vue";
import { Blueprint, PdfView } from "/@/components/ReFlowTask";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import { ElMessage } from "element-plus";
import { useOperationStoreHook } from "/@/store/modules/operation";
const task = useOperationStoreHook().GET_CURRENT_TASK();
let show = inject<Ref>("show");
let blueprint = inject<Ref>("blueprint");
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

// =====================
const formJson = reactive(JSON.parse(task.form));
const formData = reactive({});
const optionData = reactive({});
const vFormRef = ref(null);

const submitForm = () => {
  vFormRef.value
    .getFormData()
    .then(formData => {
      // Form Validation OK
      alert(JSON.stringify(formData));
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
</style>
