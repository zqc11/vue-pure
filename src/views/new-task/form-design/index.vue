<template>
  <v-form-designer ref="vfdRef"></v-form-designer>
</template>

<script setup lang="ts">
import { ref } from "vue";
const vfdRef = ref(null);
</script>

<style scoped>
body {
  margin: 0;
}
</style>
