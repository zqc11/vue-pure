<script setup lang="ts">
import { ref, reactive } from "vue";
import { templateRef } from "@vueuse/core";
import SeamlessScroll from "/@/components/ReSeamlessScroll";

const scroll = templateRef<ElRef | null>("scroll", null);

let listData = ref([
  {
    date: "2021-09-01",
    name: "1号图纸",
    star: "完成"
  },
  {
    date: "2021-09-02",
    name: "2号图纸",
    star: "线型检查"
  },
  {
    date: "2021-09-03",
    name: "2号图纸",
    star: "强度校核"
  },
  {
    date: "2021-09-04",
    name: "2号图纸",
    star: "工艺校核"
  },
  {
    date: "2021-09-05",
    name: "3号图纸",
    star: "绘制中"
  },
  {
    date: "2021-09-06",
    name: "2号图纸",
    star: "完成"
  },
  {
    date: "2021-09-07",
    name: "3号图纸",
    star: "线型检查"
  },
  {
    date: "2021-09-08",
    name: "3号图纸",
    star: "不合格，退回"
  },
  {
    date: "2021-09-09",
    name: "3号图纸",
    star: "修订中"
  },
  {
    date: "2021-09-10",
    name: "3号图纸",
    star: "完成"
  }
]);

let classOption = reactive({
  direction: "top"
});
</script>

<template>
  <div class="infinite">
    <ul class="top">
      <li>更新日期</li>
      <li>项目名称</li>
      <li>当前进度</li>
    </ul>
    <SeamlessScroll
      ref="scroll"
      :data="listData"
      :class-option="classOption"
      class="warp"
    >
      <ul class="item">
        <li v-for="(item, index) in listData" :key="index">
          <span v-text="item.date"></span>
          <span v-text="item.name"></span>
          <span v-text="item.star"></span>
        </li>
      </ul>
    </SeamlessScroll>
  </div>
</template>

<style lang="scss" scoped>
.infinite {
  .top {
    width: 95%;
    height: 40px;
    line-height: 40px;
    display: flex;
    margin: 0 auto;
    font-size: 14px;
    color: #909399;
    font-weight: 400;
    background: #fafafa;

    li {
      width: 34%;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .warp {
    width: 95%;
    height: 215px;
    margin: 0 auto;
    overflow: hidden;

    li {
      height: 30px;
      line-height: 30px;
      display: flex;
      font-size: 15px;
    }

    span {
      width: 34%;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
