<script setup lang="ts">
import {
  ReUserInfo,
  ReInfinite,
  RePie,
  ReLine,
  ReBar
} from "/@/components/ReCharts/index";
import { ref, computed, onMounted } from "vue";
import avatars from "/@/assets/avatars.jpg";
import { getStatistics } from "../api/user";
import { ResultType } from "../store/modules/types";
import { storageLocal } from "../utils/storage";

const date: Date = new Date();
let loading = ref<boolean>(true);
let operationLog = ref([]);
let statistics = ref([]);
let data2 = ref({
  keys: [],
  values: []
});
onMounted(() => {
  const id = storageLocal.getItem("info")["userInfo"].id;
  getStatistics(id).then((data: ResultType) => {
    if (data.success) {
      operationLog.value = data.data;

      let map = new Map<string, number>();
      for (var i in data.data) {
        let status = data.data[i].status;
        if (map.has(status)) {
          map.set(status, map.get(status) + 1);
        } else {
          map.set(status, 1);
        }
      }
      for (let [key, value] of map) {
        statistics.value.push({ value: value, name: key });
        data2.value.keys.push(key);
        data2.value.values.push(value);
      }
    }
  });
});

setTimeout(() => {
  loading.value = !loading.value;
}, 800);

let greetings = computed(() => {
  if (date.getHours() >= 0 && date.getHours() < 12) {
    return "上午阳光明媚，祝你薪水翻倍🌞！";
  } else if (date.getHours() >= 12 && date.getHours() < 18) {
    return "下午小风娇好，愿你青春不老😃！";
  } else {
    return "折一根天使羽毛，愿拂去您的疲惫烦恼忧伤🌛！";
  }
});
</script>

<template>
  <div class="welcome">
    <el-card class="top-content">
      <div class="left-mark">
        <img :src="avatars" />
        <span>{{ greetings }}</span>
      </div>
    </el-card>

    <el-row :gutter="24" style="margin: 20px">
      <!-- 用户信息 -->
      <el-col
        style="margin-bottom: 20px"
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
        <el-card>
          <template #header>
            <span style="font-size: 16px; font-weight: 500">用户信息</span>
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <ReUserInfo />
            </template>
          </el-skeleton>
        </el-card>
      </el-col>

      <!-- 滚动消息 -->
      <el-col
        style="margin-bottom: 20px"
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
        <el-card>
          <template #header>
            <span style="font-size: 16px; font-weight: 500">图纸进度信息</span>
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <ReInfinite :listData="operationLog" />
            </template>
          </el-skeleton>
        </el-card>
      </el-col>

      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="12"
        :xl="12"
        style="margin-bottom: 20px"
        v-motion
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 400
          }
        }"
      >
        <el-card>
          <template #header>
            <span style="font-size: 16px; font-weight: 500">图纸状态信息</span>
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <RePie :data="statistics" />
            </template>
          </el-skeleton>
        </el-card>
      </el-col>

      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="12"
        :xl="12"
        style="margin-bottom: 20px"
        v-motion
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 400
          }
        }"
      >
        <el-card>
          <template #header>
            <span style="font-size: 16px; font-weight: 500"
              >图纸状态折线图信息</span
            >
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <ReLine :data="data2" />
            </template>
          </el-skeleton>
        </el-card>
      </el-col>

      <el-col
        style="margin-bottom: 20px"
        v-motion
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 400
          }
        }"
      >
        <el-card>
          <template #header>
            <span style="font-size: 16px; font-weight: 500"
              >图纸状态柱状图信息</span
            >
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <ReBar :data="data2" />
            </template>
          </el-skeleton>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style module scoped>
.size {
  height: 335px;
}
</style>

<style lang="scss" scoped>
.main-content {
  margin: 0;
}

.welcome {
  height: 100%;

  .top-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    background: #fff;

    .left-mark {
      display: flex;
      align-items: center;

      img {
        display: block;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 10px;
        cursor: pointer;
      }

      span {
        font-size: 14px;
      }
    }
  }
}
</style>
