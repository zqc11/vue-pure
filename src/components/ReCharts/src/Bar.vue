<script lang="ts">
export default {
  name: "Bar"
};
</script>

<script setup lang="ts">
import { ECharts } from "echarts";
import echarts from "/@/plugins/echarts";
import { onBeforeMount, onMounted, nextTick } from "vue";
import { useEventListener, tryOnUnmounted, useTimeoutFn } from "@vueuse/core";

let echartInstance: ECharts;

const props = defineProps({
  index: {
    type: Number,
    default: 0
  },
  data: {
    default: {
      keys: [],
      values: []
    }
  }
});

let keys = [];
let values = [];

function initechartInstance() {
  for (var i in props.data) {
    keys.push(props.data[i].name);
    values.push(props.data[i].value);
  }
  const echartDom = document.querySelector(".bar" + props.index);
  if (!echartDom) return;
  // @ts-ignore
  echartInstance = echarts.init(echartDom);
  echartInstance.clear(); //清除旧画布 重新渲染

  echartInstance.setOption({
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    grid: {
      bottom: "20%",
      height: "68%",
      containLabel: true
    },
    xAxis: [
      {
        type: "category",
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          interval: 0
          // width: "70",
          // overflow: "truncate"
        },
        data: props.data.keys
      }
    ],
    yAxis: [
      {
        type: "value"
      }
    ],
    series: [
      {
        name: "图纸柱状信息",
        type: "bar",
        data: props.data.values
      }
    ]
  });
}

onBeforeMount(() => {
  nextTick(() => {
    initechartInstance();
  });
});

onMounted(() => {
  nextTick(() => {
    useEventListener("resize", () => {
      if (!echartInstance) return;
      useTimeoutFn(() => {
        echartInstance.resize();
      }, 180);
    });
  });
});

tryOnUnmounted(() => {
  if (!echartInstance) return;
  echartInstance.dispose();
  echartInstance = null;
});
</script>

<template>
  <div
    :class="'bar' + props.index"
    style="width: 100%; height: 35vh"
    v-if="props.data.keys.length > 0"
  ></div>
  <div v-else>暂无数据或无权限</div>
</template>
