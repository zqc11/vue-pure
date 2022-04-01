<template>
  <div>
    <el-row justify="end">
      <el-col>
        <el-button @click="cleanAll">清空</el-button>
        <el-button type="primary" @click="next">下一步</el-button>
      </el-col>
    </el-row>
    <el-divider />
    <el-upload
      class="uploadfile-wrapper"
      drag
      multiple
      ref="uploadRef"
      accept=".dwg, .dxf, .pdf"
      action="http://localhost:8080/multiUpload"
      :on-change="onChange"
      :on-remove="onRemove"
      :on-error="onError"
      :auto-upload="false"
      :file-list="pdfFileList"
      v-loading="loading"
      element-loading-text="正在上传,请稍侯..."
    >
      <el-icon class="el-icon--upload" color="#0000ff">
        <upload-filled />
      </el-icon>
      <div class="el-upload__text">
        拖放文件 或
        <em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">支持 AutoCAD 的 dwg 和 dxf 文件类型</div>
      </template>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { UploadFilled } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import vjmap from "vjmap";
import { useAppStore } from "/@/store/modules/vjmap/app";
import { ref } from "vue";
import { showError } from "/@/utils/ui/ui";
import { UploadFile } from "element-plus/lib/components/upload/src/upload.type";
import { useFlowTaskStoreHook } from "/@/store/modules/flowTask";
// import { uploadFiles } from "/@/api/task";
// import { ResultType } from "/@/store/modules/types";
import { ElMessage } from "element-plus";

const loading = ref(false);
const pdfFileList = ref<UploadFile[]>([]);
const dwgFileList = ref<UploadFile[]>([]);
const emit = defineEmits(["next"]);

const uploadRef = ref();
const app = useAppStore();
const router = useRouter();

let svc = new vjmap.Service(app.serviceUrl, app.accessToken);

const onChange = file => {
  if (file.status === "ready") {
    const isPdf = file.name.endsWith(".pdf");
    if (isPdf) {
      // 如果是pdf文件
      pdfFileList.value.push(file);
    } else {
      // 如果是dwg文件
      dwgFileList.value.push(file);
    }
  }
};

const onRemove = file => {
  const isPdf = file.name.endsWith(".pdf");
  if (isPdf) {
    pdfFileList.value.splice(pdfFileList.value.indexOf(file), 1);
  } else {
    dwgFileList.value.splice(dwgFileList.value.indexOf(file), 1);
  }
};

const onError = (error, file) => {
  console.log(file);
  ElMessage.error("文件：" + file.name + " 过大上传失败");
};

const cleanAll = () => {
  pdfFileList.value = [];
  dwgFileList.value = [];
  useFlowTaskStoreHook().$state.uploadFiles = [];
};

const next = () => {
  // 准备上传
  loading.value = true;

  dwgFileList.value.forEach(file => {
    const uploadFile = {
      filename: file.name,
      type: 1
    };
    useFlowTaskStoreHook().$state.uploadFiles.push(uploadFile);
    uploadDwgFile(file);
  });

  pdfFileList.value.forEach(file => {
    const uploadFile = {
      filename: file.name,
      type: 2
    };
    useFlowTaskStoreHook().$state.uploadFiles.push(uploadFile);
  });
  uploadRef.value!.submit();
  loading.value = false;
  router.push("/newTask/formDesign");
  emit("next", 2);
  // uploadFiles(pdfFileList.value)
  //   .then((data: ResultType) => {
  //     loading.value = false;
  //     if (data.success) {
  //       router.push("/newTask/formDesign");
  //       emit("next", 2);
  //     }
  //   })
  //   .catch(error => {
  //     loading.value = false;
  //     ElMessage.error(error.message);
  //   });
};
const uploadDwgFile = async (file: any) => {
  if (!file) return;
  try {
    // 上传图纸
    let res = await svc.uploadMap(file.raw);
    console.log(res);
    // 新建图形
    const data = await svc.openMap(res);
    if (data.error) {
      showError("打开图形失败!", data.error);
    } else {
      // 保存我上存的图形ID
      app.addMyMapId(res.mapId);
    }
  } catch (error) {
    // 上传失败
    loading.value = false;
    showError("上传图形失败!", error);
  }
};
</script>

<style scoped>
.uploadfile-wrapper {
  /* height: 400px; */
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

:deep .el-upload-dragger {
  border: 1px dashed #2b47e7 !important;
}
</style>
