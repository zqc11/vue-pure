<template>
  <el-form :model="form">
    <el-row justify="start" :gutter="10" class="form-item-container">
      <el-col :span="5">
        <!-- 维护权限 -->
        <el-form-item label="维护权限">
          <el-select v-model="form.maintain.type" placeholder="请选择">
            <el-option label="人员" value="1" />
            <el-option label="部门" value="2" />
            <el-option label="群组" value="3" />
            <el-option label="所有人" value="4" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="19">
        <el-form-item>
          <el-tag
            v-for="(checker, index) in form.maintain.list"
            :key="index"
            class="check-container"
            closable
            @close="remove(form.maintain.list, index)"
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
              @click="addToCheckers(form.maintain.list, index)"
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
      <el-col :span="5">
        <!-- 统计权限 -->
        <el-form-item label="统计权限">
          <el-select v-model="form.statistics.type" placeholder="请选择">
            <el-option label="人员" value="1" />
            <el-option label="部门" value="2" />
            <el-option label="群组" value="3" />
            <el-option label="所有人" value="4" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="19">
        <el-form-item>
          <el-tag
            v-for="(checker, index) in form.statistics.list"
            :key="index"
            class="check-container"
            closable
            @close="remove(form.statistics.list, index)"
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
              @click="addToCheckers(form.statistics.list, index)"
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
const router = useRouter();
const maintainDialogVisible = ref(false);
const statisticsDialogVisible = ref(false);
const colleague = ref([]);
colleague.value.push({ name: "王小刚" });
colleague.value.push({ name: "方世玉" });
colleague.value.push({ name: "张凯峰" });
const form = reactive({
  maintain: {
    type: "",
    list: []
  },
  statistics: {
    type: "",
    list: []
  }
});
const emit = defineEmits(["next"]);
function next() {
  useFlowTaskStoreHook().$reset();
  router.push("/flowTask/index");
  emit("next", 0);
}
const remove = (array, index) => {
  array.splice(index, 1);
};
const openCheckerDialog = type => {
  if (type == "maintain") {
    maintainDialogVisible.value = true;
  } else {
    statisticsDialogVisible.value = true;
  }
};
const addToCheckers = (array, index) => {
  array.push(colleague.value[index]);
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
