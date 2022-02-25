<template>
  <el-row type="flex" justify="center">
    <el-col id="upload-box" :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
      <el-upload
        ref="uploadRef"
        class="upload"
        action="https://jsonplaceholder.typicode.com/posts/"
        :auto-upload="false"
        :before-upload="beforeDWGUpload"
        accept=".dwg"
        drag
        multiple
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">拖拽文件到此处或<em>点击选择文件</em></div>
        <template #tip>
          <div class="el-upload__tip">
            只支持10MB大小以内的DWG文件，没有图纸请直接下一步
          </div>
        </template>
      </el-upload>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-button class="ml-3" type="default" @click="clearFiles"
            >清空已选择文件</el-button
          >
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-button class="ml-3" type="success" @click="submitUpload"
            >上传图纸并进入下一步</el-button
          >
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { ElMessage, ElUpload } from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";
import { ElFile } from "element-plus/es/components/upload/src/upload.type";
import { useRouter } from "vue-router";

const uploadRef = ref<InstanceType<typeof ElUpload>>();
const emit = defineEmits(["next"]);
const router = useRouter();

const submitUpload = () => {
  uploadRef.value!.submit();
  router.push("/newTask/formDesign");
  emit("next", 2);
};
const clearFiles = () => {
  uploadRef.value!.clearFiles();
};
const beforeDWGUpload = (file: ElFile) => {
  const isDWG = file.name.split(".")[1] === "dwg";
  const isLt10M = file.size / 1024 / 1024 < 10;

  if (!isDWG) {
    ElMessage.error("图纸文件只支持dwg格式");
  }
  if (!isLt10M) {
    ElMessage.error("图纸文件大小不能超过10MB!");
  }
  return isDWG && isLt10M;
};
</script>
<style scoped>
#upload-box {
  margin-top: 20px;
  display: flex;
  flex-flow: column;
  align-items: center;
  padding: 20px;
}
</style>
