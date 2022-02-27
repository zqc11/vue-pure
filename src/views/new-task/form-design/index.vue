<template>
  <div>
    <el-row :gutter="20" type="flex" justify="end">
      <el-col>
        <el-button>下一步</el-button>
      </el-col>
    </el-row>
    <v-form-designer ref="vfdRef">
      <!--       <el-button v-slot="button">TEST</el-button> -->
    </v-form-designer>
  </div>
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
