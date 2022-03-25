<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { initRouter } from "/@/router/utils";
import { storageLocal, storageSession } from "/@/utils/storage";
import { addClass, removeClass } from "/@/utils/operate";
import bg from "/@/assets/login/bg.png";
import avatar from "/@/assets/login/avatar.svg?component";
import illustration0 from "/@/assets/login/illustration0.svg?component";
import illustration1 from "/@/assets/login/illustration1.svg?component";
import illustration2 from "/@/assets/login/illustration2.svg?component";
import illustration3 from "/@/assets/login/illustration3.svg?component";
import illustration4 from "/@/assets/login/illustration4.svg?component";
import illustration5 from "/@/assets/login/illustration5.svg?component";
import illustration6 from "/@/assets/login/illustration6.svg?component";
import { useUserStoreHook } from "../store/modules/user";
import { ElMessage } from "element-plus";

// vue.$router
const router = useRouter();

// eslint-disable-next-line vue/return-in-computed-property
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

let account = ref("");
let password = ref("");

const onLogin = (): void => {
  useUserStoreHook()
    .loginByUsername({
      account: account.value,
      password: password.value
    })
    .then(response => {
      const data = response.data;
      if (response.success) {
        // 本地存储
        storageLocal.setItem("info", {
          user_info: data,
          accessToken: data.accessToken
        });
        // 会话存储: 关闭浏览器会清空
        storageSession.setItem("info", {
          user_info: data,
          accessToken: data.accessToken
        });
        initRouter(data.account).then(() => {});
        router.push("/");
      } else {
        ElMessage.error(response.msg);
      }
    })
    .catch(error => {
      console.log(error);
    });
};

function onUserFocus() {
  addClass(document.querySelector(".user"), "focus");
}

function onUserBlur() {
  if (account.value.length === 0)
    removeClass(document.querySelector(".user"), "focus");
}

function onPwdFocus() {
  addClass(document.querySelector(".pwd"), "focus");
}

function onPwdBlur() {
  if (password.value.length === 0)
    removeClass(document.querySelector(".pwd"), "focus");
}
</script>

<template>
  <div>
    <img :src="bg" class="wave" />
    <div class="login-container">
      <div class="img">
        <component :is="currentWeek"></component>
      </div>
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
          <div
            class="input-group user focus"
            v-motion
            :initial="{
              opacity: 0,
              y: 100
            }"
            :enter="{
              opacity: 1,
              y: 0,
              transition: {
                delay: 200
              }
            }"
          >
            <div class="icon">
              <IconifyIconOffline icon="fa-user" width="14" height="14" />
            </div>
            <div>
              <h5>用户名</h5>
              <input
                type="text"
                class="input"
                v-model="account"
                @focus="onUserFocus"
                @blur="onUserBlur"
              />
            </div>
          </div>
          <div
            class="input-group pwd focus"
            v-motion
            :initial="{
              opacity: 0,
              y: 100
            }"
            :enter="{
              opacity: 1,
              y: 0,
              transition: {
                delay: 300
              }
            }"
          >
            <div class="icon">
              <IconifyIconOffline icon="fa-lock" width="14" height="14" />
            </div>
            <div>
              <h5>密码</h5>
              <input
                type="password"
                class="input"
                v-model="password"
                @focus="onPwdFocus"
                @blur="onPwdBlur"
              />
            </div>
          </div>
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
            @click="onLogin"
          >
            登录
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("/@/style/login.css");
</style>
