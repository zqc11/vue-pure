<template>
  <div>
    <v-form-designer ref="vfdRef">
      <el-button :v-slot="button" type="primary" size="small" @click="next"
        >下一步</el-button
      >
    </v-form-designer>
  </div>
</template>

<script setup lang="ts">
import { ref, unref } from "vue";
import { useRouter } from "vue-router";
import { useFlowTaskStoreHook } from "/@/store/modules/flowTask";
const vfdRef = ref(null);
const router = useRouter();
const emit = defineEmits(["next"]);
const next = () => {
  useFlowTaskStoreHook().setformData(
    JSON.stringify(unref(vfdRef).getFormJson())
  );
  router.push("/newTask/flowChart");
  emit("next", 3);
};
</script>

<style scoped>
body {
  margin: 0;
}
</style>
