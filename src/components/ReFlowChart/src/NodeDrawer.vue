<template>
  <el-drawer
    :model-value="openDrawer"
    title="节点信息"
    direction="rtl"
    :before-close="handleClose"
  >
    <el-form :model="node" label-width="120px">
      <el-form-item label="节点名称">
        <el-input v-model="node.text.value">{{ node.text.value }}</el-input>
      </el-form-item>
      <el-form-item label="节点描述">
        <el-input v-model="node.properties.desc">{{
          node.properties.desc
        }}</el-input>
      </el-form-item>
      <el-form-item label="审批人">
        <div v-for="(n, k) in 4" :key="k" class="check-container">
          <el-tag>
            hello
            <el-button
              :icon="CircleClose"
              size="small"
              type="danger"
              class="close-button"
              plain
            ></el-button>
          </el-tag>
        </div>
        <el-button
          type="primary"
          size="small"
          :icon="CirclePlus"
          circle
        ></el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup lang="ts">
import { inject, Ref } from "vue";
import { CirclePlus, CircleClose } from "@element-plus/icons-vue";
let openDrawer = inject<Ref>("openNodeDrawer");
const node = inject<Ref>("selectedNode");
// do not use same name with ref

const handleClose = () => {
  openDrawer.value = false;
};
</script>

<style scoped>
.close-button {
  background: transparent;
  border: 0px;
  padding: 0px;
}

.close-button:hover {
  background: transparent;
  color: gray;
}

.check-container {
  margin-right: 10px;
}
</style>
