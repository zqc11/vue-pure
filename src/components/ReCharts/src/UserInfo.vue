<script setup lang="ts">
import { ref } from "vue";
import { storageLocal } from "/@/utils/storage";
const lists = ref([
  { type: "", label: "善良" },
  { type: "success", label: "好学" },
  { type: "info", label: "幽默" },
  { type: "danger", label: "旅游" },
  { type: "warning", label: "追剧" }
]);
const info = storageLocal.getItem("info").userInfo;
const userInfo = {
  name: info.name,
  tel: info.mobile,
  department: info.department
};
</script>

<template>
  <el-descriptions class="margin-top" direction="vertical" :column="3" border>
    <el-descriptions-item>
      <template #label>
        <el-icon>
          <IconifyIconOffline icon="user" />
        </el-icon>
        用户名
      </template>
      {{ userInfo.name }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <el-icon>
          <IconifyIconOffline icon="iphone" />
        </el-icon>
        手机号
      </template>
      {{ userInfo.tel }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <el-icon>
          <IconifyIconOffline icon="location" />
        </el-icon>
        所在部门
      </template>
      {{ userInfo.department }}
    </el-descriptions-item>
  </el-descriptions>
  <el-descriptions class="margin-top" direction="vertical" :column="1" border>
    <el-descriptions-item>
      <template #label>
        <el-icon>
          <IconifyIconOffline icon="tickets" />
        </el-icon>
        标签
      </template>
      <el-tag
        v-for="item in lists"
        :key="item.label"
        :type="item.type"
        size="small"
        effect="dark"
      >
        {{ item.label }}
      </el-tag>
    </el-descriptions-item>
  </el-descriptions>
</template>

<style scoped>
.el-tag {
  margin-right: 10px !important;
}
</style>
