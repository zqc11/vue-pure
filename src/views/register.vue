<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import bg from "/@/assets/login/bg.png";
import avatar from "/@/assets/login/avatar.svg?component";
import illustration0 from "/@/assets/login/illustration0.svg?component";
import illustration1 from "/@/assets/login/illustration1.svg?component";
import illustration2 from "/@/assets/login/illustration2.svg?component";
import illustration3 from "/@/assets/login/illustration3.svg?component";
import illustration4 from "/@/assets/login/illustration4.svg?component";
import illustration5 from "/@/assets/login/illustration5.svg?component";
import illustration6 from "/@/assets/login/illustration6.svg?component";
import { register, validate } from "../api/user";
import { ResultType } from "../store/modules/types";
import { ElMessage } from "element-plus";

/* 变量定义 */
const router = useRouter();
const formRef = ref();
const registerForm = reactive({
  account: "",
  password: "",
  name: "",
  mobile: "",
  gender: 1,
  department: ""
});
const validateAccount = (_rule, value, callback) => {
  if (!formRef.value) return;
  validate(value).then((response: ResultType) => {
    if (response.success) {
      callback();
    } else {
      callback(new Error(response.msg));
    }
  });
};
const rules = reactive({
  account: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    {
      min: 3,
      max: 10,
      message: "用户名长度必须为 3 到 10 个字符",
      trigger: "blur"
    },
    {
      validator: validateAccount,
      trigger: "blur"
    }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      min: 6,
      max: 11,
      message: "密码长度必须为 6 到 11 个字符",
      trigger: "blur"
    }
  ],
  name: [
    { required: true, message: "请输入姓名", trigger: "blur" },
    {
      min: 2,
      max: 20,
      message: "姓名长度必须为 2 到 20 个字符",
      trigger: "blur"
    }
  ],
  mobile: [
    {
      required: true,
      message: "请输入手机号",
      trigger: "blur"
    },
    {
      min: 3,
      max: 11,
      message: "手机长度必须为 3 到 11 个字符",
      trigger: "blur"
    }
  ]
});
const currentWeek = computed(() => {
  switch (String(new Date().getDay())) {
    case "0":
      return illustration0;
    case "1":
      return illustration1;
    case "2":
      return illustration2;
    case "3":
      return illustration3;
    case "4":
      return illustration4;
    case "5":
      return illustration5;
    case "6":
      return illustration6;
    default:
      return illustration4;
  }
});

/* 方法定义 */
const onRegister = (): void => {
  if (!formRef.value) return;
  formRef.value.validate(valid => {
    if (valid) {
      const data = registerForm;
      register(data).then((response: ResultType) => {
        if (response.success) {
          ElMessage.success("注册成功");
          backToLogin();
        }
      });
    }
  });
};

const backToLogin = () => {
  router.push("/login");
};
</script>

<template>
  <div>
    <img :src="bg" class="wave" />
    <div class="login-container">
      <div class="img">
        <component :is="currentWeek"></component>
      </div>
      <!-- 注册表单 -->
      <div class="login-box">
        <div class="login-form">
          <avatar class="avatar" />
          <h2
            v-motion
            :initial="{
              opacity: 0,
              y: 100
            }"
            :enter="{
              opacity: 1,
              y: 0,
              transition: {
                delay: 100
              }
            }"
          >
            机械图纸管理系统
          </h2>
          <el-form
            label-position="top"
            label-width="100px"
            :model="registerForm"
            :rules="rules"
            ref="formRef"
            style="max-width: 460px"
          >
            <el-form-item label="用户名" prop="account">
              <el-input v-model="registerForm.account" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="registerForm.password" type="password" />
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input v-model="registerForm.name" />
            </el-form-item>
            <el-form-item label="电话" prop="mobile">
              <el-input v-model="registerForm.mobile" />
            </el-form-item>
            <el-form-item label="性别">
              <el-select v-model="registerForm.gender" placeholder="请选择性别">
                <el-option label="男" :value="1" />
                <el-option label="女" :value="0" />
              </el-select>
            </el-form-item>
            <el-form-item label="部门">
              <el-input v-model="registerForm.department" />
            </el-form-item>
          </el-form>
          <div class="btn-container">
            <button
              class="btn"
              v-motion
              :initial="{
                opacity: 0,
                y: 10
              }"
              :enter="{
                opacity: 1,
                y: 0,
                transition: {
                  delay: 400
                }
              }"
              @click="backToLogin"
            >
              返回登录
            </button>
            <button
              class="btn register"
              v-motion
              :initial="{
                opacity: 0,
                y: 10
              }"
              :enter="{
                opacity: 1,
                y: 0,
                transition: {
                  delay: 400
                }
              }"
              @click="onRegister"
            >
              提交
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("/@/style/login.css");

.register {
  background-image: linear-gradient(
    to right,
    rgb(20, 201, 195),
    rgb(80, 222, 218),
    rgb(120, 222, 218)
  );
  margin-left: 10px;
}

.btn-container {
  display: flex;
}
</style>
