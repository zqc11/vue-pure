<template>
  <el-drawer
    :model-value="openDrawer"
    title="节点信息"
    direction="rtl"
    :before-close="handleClose"
  >
    <el-form :model="edge" label-width="120px">
      <el-form-item label="出口名称">
        <el-input v-model="edge.text.value">{{ node.text.value }}</el-input>
      </el-form-item>
      <el-form-item label="出口描述">
        <el-input v-model="edge.properties.desc">{{
          edge.properties.desc
        }}</el-input>
      </el-form-item>
      <el-form-item label="出口逻辑">
        <el-select
          v-model="edge.properties.condition"
          placeholder="选择出口逻辑"
        >
          <el-option label="全部通过" value="and" />
          <el-option label="其一通过" value="or" />
        </el-select>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup lang="ts">
import { inject, Ref } from "vue";
let openDrawer = inject<Ref>("openEdgeDrawer");
const edge = inject<Ref>("selectedEdge");
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
