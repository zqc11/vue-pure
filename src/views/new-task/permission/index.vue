<template>
  <el-form :model="form">
    <el-row justify="start" :gutter="10" class="form-item-container">
      <el-col>
        <el-form-item label="维护权限">
          <el-tag
            v-for="(checker, index) in form2.maintain"
            :key="index"
            class="check-container"
            closable
            @close="remove(form.maintain, index, 'maintain')"
          >
            {{ checker.name }}
          </el-tag>
          <el-button
            type="primary"
            size="small"
            :icon="CirclePlus"
            @click="openCheckerDialog('maintain')"
            circle
          ></el-button>
          <el-dialog
            v-model="maintainDialogVisible"
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
              @click="addToCheckers(form.maintain, index, 'maintain')"
            >
              {{ checker.name }}
            </el-tag>

            <template #footer>
              <span class="dialog-footer">
                <el-button type="primary" @click="maintainDialogVisible = false"
                  >确定</el-button
                >
              </span>
            </template>
          </el-dialog>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10" justify="start" class="form-item-container">
      <el-col :span="24">
        <el-form-item label="统计权限">
          <el-tag
            v-for="(checker, index) in form2.statistics"
            :key="index"
            class="check-container"
            closable
            @close="remove(form.statistics, index, 'statistics')"
          >
            {{ checker.name }}
          </el-tag>
          <el-button
            type="primary"
            size="small"
            :icon="CirclePlus"
            @click="openCheckerDialog('statistics')"
            circle
          ></el-button>
          <el-dialog
            v-model="statisticsDialogVisible"
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
              @click="addToCheckers(form.statistics, index, 'statistics')"
            >
              {{ checker.name }}
            </el-tag>

            <template #footer>
              <span class="dialog-footer">
                <el-button
                  type="primary"
                  @click="statisticsDialogVisible = false"
                  >确定</el-button
                >
              </span>
            </template>
          </el-dialog>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <el-row justify="end">
    <el-col :span="1">
      <el-button type="primary" @click="next">完成</el-button>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { CirclePlus, Search } from "@element-plus/icons-vue";
import { useFlowTaskStoreHook } from "/@/store/modules/flowTask";
import { useRouter } from "vue-router";
import { storageLocal } from "/@/utils/storage";
import { getFriends, getUserById } from "/@/api/user";
import { ResultType } from "/@/store/modules/types";
import { ElMessage } from "element-plus";
import { postTask } from "/@/api/task";
const router = useRouter();
const maintainDialogVisible = ref(false);
const statisticsDialogVisible = ref(false);
const colleague = ref([]);
const form = reactive({
  maintain: [],
  statistics: []
});
const form2 = reactive({
  maintain: [],
  statistics: []
});
const addToform2 = (id, array) => {
  getUserById(id).then((response: ResultType) => {
    if (response.success) {
      array.push(response.data);
    }
  });
};
const emit = defineEmits(["next"]);
function next() {
  useFlowTaskStoreHook().setPermission(form);
  postTask(useFlowTaskStoreHook().$state)
    .then((response: ResultType) => {
      if (response.success) {
        useFlowTaskStoreHook().$reset();
        router.push("/flowTask/index");
        emit("next", 0);
      }
    })
    .catch(error => {
      ElMessage.error(error.message);
    });
}
const remove = (array, index, type) => {
  array.splice(index, 1);
  let array2;
  if (type === "maintain") {
    array2 = form2.maintain;
  } else {
    array2 = form2.statistics;
  }
  array2.splice(index, 1);
};
const openCheckerDialog = type => {
  const id = storageLocal.getItem("info")["userInfo"].id;
  getFriends(id).then((response: ResultType) => {
    if (response.success) {
      colleague.value = response.data;
    }
  });
  if (type == "maintain") {
    maintainDialogVisible.value = true;
  } else {
    statisticsDialogVisible.value = true;
  }
};
const addToCheckers = (array: Array<number>, index, type) => {
  const id = colleague.value[index].id;
  const findIndex = array.findIndex(item => item === id);
  if (findIndex >= 0) {
    return;
  }
  array.push(id);
  let array2;
  if (type === "maintain") {
    array2 = form2.maintain;
  } else {
    array2 = form2.statistics;
  }
  addToform2(id, array2);
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

.form-item-container {
  background-color: white;
}
</style>
