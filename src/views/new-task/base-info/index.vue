<template>
  <div id="base-info">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="ruleForm"
      :size="formSize"
    >
      <el-form-item label="流程名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="流程类型" prop="region">
        <el-select v-model="ruleForm.region" placeholder="选择类型">
          <el-option label="图纸" value="shanghai"></el-option>
          <el-option label="普通" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="流程描述" prop="desc">
        <el-input v-model="ruleForm.desc" type="textarea"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)"
          >下一步</el-button
        >
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { ElForm } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();
type FormInstance = InstanceType<typeof ElForm>;
const emit = defineEmits(["next"]);
const formSize = ref("");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: ""
});

const rules = reactive({
  name: [
    {
      required: true,
      message: "Please input Activity name",
      trigger: "blur"
    },
    {
      min: 3,
      max: 5,
      message: "Length should be 3 to 5",
      trigger: "blur"
    }
  ],
  region: [
    {
      required: true,
      message: "Please select Activity zone",
      trigger: "change"
    }
  ],
  desc: [
    {
      required: false,
      message: "Please input activity form",
      trigger: "blur"
    }
  ]
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      console.log("submit!");
      router.push("/newTask/upload");
      emit("next", 1);
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>
<style scoped>
#base-info {
  margin-top: 20px;
  background-color: white;
  width: 90%;
  margin-left: 5%;
  display: flex;
  justify-content: center;
}

.ruleForm {
  width: 90%;
  padding: 20px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-content: center;
}
</style>
