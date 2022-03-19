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
      <el-form-item label="流程名称" prop="title">
        <el-input v-model="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="流程类型" prop="type">
        <el-select v-model="ruleForm.type" placeholder="选择类型">
          <el-option label="图纸" value="blueprint"></el-option>
          <el-option label="普通" value="ordinary"></el-option>
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
import { useFlowTaskStoreHook } from "/@/store/modules/flowTask";
const router = useRouter();
type FormInstance = InstanceType<typeof ElForm>;
const emit = defineEmits(["next"]);
const formSize = ref("");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  title: "",
  desc: "",
  type: ""
});

const rules = reactive({
  title: [
    {
      required: true,
      message: "请输入流程名称",
      trigger: "blur"
    },
    {
      min: 1,
      max: 10,
      message: "长度限制在1到10个字符",
      trigger: "blur"
    }
  ],
  type: [
    {
      required: true,
      message: "请选择流程类型",
      trigger: "blur"
    }
  ],
  desc: [
    {
      required: false,
      message: "",
      trigger: "blur"
    }
  ]
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      useFlowTaskStoreHook().setBaseInfo(ruleForm);
      console.log(
        useFlowTaskStoreHook().baseInfo.title +
          useFlowTaskStoreHook().baseInfo.desc
      );
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
