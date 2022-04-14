<script setup lang="ts">
import { ref, unref, onMounted } from "vue";
import { templateRef } from "@vueuse/core";
import { LogicFlow } from "@logicflow/core";

interface Props {
  lf: LogicFlow;
  catTurboData?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  lf: null
});

const emit = defineEmits(["catData", "next"]);

const controlButton3 = templateRef<HTMLElement | any>("controlButton3", null);
const controlButton4 = templateRef<HTMLElement | any>("controlButton4", null);

let titleLists = ref([
  {
    icon: "icon-zoom-out-hs",
    text: "缩小",
    disabled: false
  },
  {
    icon: "icon-enlarge-hs",
    text: "放大",
    disabled: false
  },
  {
    icon: "icon-full-screen-hs",
    text: "适应",
    disabled: false
  },
  {
    icon: "icon-previous-hs",
    text: "撤销",
    disabled: true
  },
  {
    icon: "icon-next-step-hs",
    text: "重做",
    disabled: true
  },
  {
    icon: "icon-watch-hs",
    text: "查看数据",
    disabled: false
  }
]);

const onControl = (item, key) => {
  ["zoom", "zoom", "resetZoom", "undo", "redo"].forEach((v, i) => {
    let domControl = props.lf;
    if (key === 1) {
      domControl.zoom(true);
    }
    if (key === 5) {
      emit("catData");
    }
    if (key === i) {
      domControl[v]();
    }
  });
};

const nextStep = () => {
  emit("next");
};

onMounted(() => {
  props.lf.on("history:change", ({ data: { undoAble, redoAble } }) => {
    unref(titleLists)[3].disabled = unref(controlButton3).disabled = !undoAble;
    unref(titleLists)[4].disabled = unref(controlButton4).disabled = !redoAble;
  });
});
</script>

<template>
  <div class="control-container">
    <!-- 功能按钮 -->
    <ul>
      <li v-for="(item, key) in titleLists" :key="key" :title="item.text">
        <el-button
          :ref="'controlButton' + key"
          :disabled="item.disabled"
          :style="{
            cursor: item.disabled === false ? 'pointer' : 'not-allowed'
          }"
          size="small"
          @click="onControl(item, key)"
        >
          <span :class="'iconfont ' + item.icon"></span>
        </el-button>
      </li>
      <li>
        <el-button type="primary" size="small" @click="nextStep">
          下一步
        </el-button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
@import "./assets/iconfont/iconfont.css";

.control-container {
  position: absolute;
  right: 20px;
  background: hsla(0, 0%, 100%, 0.8);
  box-shadow: 0 1px 4px rgb(0 0 0 / 20%);
}

.control-container p {
  margin: 0;
  font-size: 12px;
}

.control-container ul {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 2px;
}

.control-container ul li {
  width: 60px;
  text-align: center;
}

.control-container ul li button {
  border: none;
  outline: none;
}
</style>
