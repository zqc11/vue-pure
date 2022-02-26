<template>
  <div>
    <!-- 创建流程信息 -->
    <el-steps :active="active" align-center finish-status="success" simple>
      <el-step title="基本信息" :icon="List"></el-step>
      <el-step title="上传图纸" :icon="UploadFilled"></el-step>
      <el-step title="表单设计" :icon="Checked"></el-step>
      <el-step title="流程设计" :icon="Platform"></el-step>
      <el-step title="权限设置" :icon="UserFilled"></el-step>
    </el-steps>
    <!-- 不同状态下的router-view -->
    <router-view @next="next" id="router-view"></router-view>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { List } from "@element-plus/icons-vue";
import { UploadFilled } from "@element-plus/icons-vue";
import { Checked } from "@element-plus/icons-vue";
import { UserFilled } from "@element-plus/icons-vue";
import { Platform } from "@element-plus/icons-vue";

const active = ref(0);
function next(step) {
  active.value = step;
}
</script>
<style>
.el-step__title.is-process {
  color: #409eff !important;
}

.el-step__head.is-process {
  border-color: #409eff !important;
}

#router-view {
  width: 100%;
}
</style>
