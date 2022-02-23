<template>
  <div @click="showInfo(props.item)">
    <img src="./assets/cad.jpg" alt="机械图纸" />
    <span>
      {{ item.title }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps({
  item: {
    type: Object
  }
});
function showInfo(t) {
  console.log(t);
  router.push({
    path: "/taskInfo",
    query: {
      item: JSON.stringify(t)
    }
  });
}
</script>

<style></style>
