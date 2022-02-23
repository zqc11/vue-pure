<template>
  <div>
    <!-- 创建流程信息 -->
    <el-steps :active="1" align-center finish-status="success" simple>
      <el-step title="基本信息"></el-step>
      <el-step title="上传图纸"></el-step>
      <el-step title="表单设计"></el-step>
      <el-step title="流程设计"></el-step>
      <el-step title="权限设置"></el-step>
    </el-steps>
    <!-- 不同状态下的router-view -->
  </div>
</template>

<script setup lang="ts"></script>

<style>
.el-step__title.is-process {
  color: #409eff !important;
}

.el-step__head.is-process {
  border-color: #409eff !important;
}
</style>
