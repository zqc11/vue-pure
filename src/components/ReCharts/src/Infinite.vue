<script setup lang="ts">
import { reactive, ref } from "vue";
import { templateRef } from "@vueuse/core";
import SeamlessScroll from "/@/components/ReSeamlessScroll";

const scroll = templateRef<ElRef | null>("scroll", null);
const props = defineProps({
  listData: {
    default: []
  }
});
let listData = ref(props.listData);
let classOption = reactive({
  direction: "top"
});
</script>

<template>
  <div class="infinite" v-if="listData.length > 0">
    <ul class="top">
      <li>更新日期</li>
      <li>流程名称</li>
      <li>审批人</li>
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
          <span v-text="item.modifyDate"></span>
          <span v-text="item.title"></span>
          <span v-text="item.checker"></span>
          <span v-text="item.status"></span>
        </li>
      </ul>
    </SeamlessScroll>
  </div>
  <div v-else>暂无数据或无权限</div>
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
