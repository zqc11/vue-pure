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
import { reactive } from "vue";
import { CirclePlus, CircleClose } from "@element-plus/icons-vue";
import { useFlowTaskStoreHook } from "/@/store/modules/flowTask";
import { useRouter } from "vue-router";
const router = useRouter();
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
