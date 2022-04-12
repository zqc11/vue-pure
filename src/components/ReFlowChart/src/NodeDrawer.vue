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
        <el-tag
          v-for="(checker, index) in showCheckers"
          :key="index"
          class="check-container"
          closable
          @close="remove(index)"
        >
          {{ checker.name }}
        </el-tag>
        <el-button
          type="primary"
          size="small"
          :icon="CirclePlus"
          @click="openCheckerDialog"
          circle
        ></el-button>
        <el-dialog
          v-model="dialogVisible"
          title="请选择添加的审批人"
          width="30%"
        >
          <el-input placeholder="输入需要查找的账号">
            <template #append>
              <el-button type="primary" :icon="Search"></el-button>
            </template>
          </el-input>
          <el-divider />

          <el-tag
            v-for="(checker, index) in colleague"
            :key="index"
            class="check-container"
            @click="addToCheckers(index)"
          >
            {{ checker.name }}
          </el-tag>

          <template #footer>
            <span class="dialog-footer">
              <el-button type="primary" @click="dialogVisible = false"
                >确定</el-button
              >
            </span>
          </template>
        </el-dialog>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup lang="ts">
import { inject, ref, Ref } from "vue";
import { CirclePlus, Search } from "@element-plus/icons-vue";
import { getFriends, getUserById } from "/@/api/user";
import { ResultType } from "/@/store/modules/types";
import { storageLocal } from "/@/utils/storage";
let openDrawer = inject<Ref>("openNodeDrawer");
const node = inject<Ref>("selectedNode");
let checkers = ref([...node.value.properties.checkers]);
let showCheckers = ref([]);
const addToShowCheckers = id => {
  getUserById(id).then((response: ResultType) => {
    if (response.success) {
      showCheckers.value.push(response.data);
    }
  });
};
checkers.value.forEach(id => {
  addToShowCheckers(id);
});
const colleague = ref([]);
const dialogVisible = ref(false);
const handleClose = () => {
  openDrawer.value = false;
  dialogVisible.value = false;
  node.value.properties.checkers = [...checkers.value];
};
const remove = index => {
  checkers.value.splice(index, 1);
};
const openCheckerDialog = () => {
  dialogVisible.value = true;
  const id = storageLocal.getItem("info")["userInfo"].id;
  getFriends(id).then((response: ResultType) => {
    if (response.success) {
      colleague.value = response.data;
    }
  });
};
const addToCheckers = index => {
  const id = colleague.value[index].id;
  const findIndex = checkers.value.findIndex(item => item === id);
  if (findIndex >= 0) {
    return;
  }
  addToShowCheckers(id);
  checkers.value.push(id);
  colleague.value.splice(index, 1);
};
</script>

<style scoped>
.check-container {
  margin-right: 10px;
}
</style>
