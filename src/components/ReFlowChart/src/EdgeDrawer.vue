<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="Activity name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="Activity zone">
      <el-select v-model="form.region" placeholder="please select your zone">
        <el-option label="Zone one" value="shanghai"></el-option>
        <el-option label="Zone two" value="beijing"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="Instant delivery">
      <el-switch v-model="form.delivery"></el-switch>
    </el-form-item>
    <el-form-item label="Activity type">
      <el-checkbox-group v-model="form.type">
        <el-checkbox label="Online activities" name="type"></el-checkbox>
        <el-checkbox label="Promotion activities" name="type"></el-checkbox>
        <el-checkbox label="Offline activities" name="type"></el-checkbox>
        <el-checkbox label="Simple brand exposure" name="type"></el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="Resources">
      <el-radio-group v-model="form.resource">
        <el-radio label="Sponsor"></el-radio>
        <el-radio label="Venue"></el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="Activity form">
      <el-input v-model="form.desc" type="textarea"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button>Cancel</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

// do not use same name with ref
const form = reactive({
  name: "",
  region: "",
  delivery: false,
  type: [],
  resource: "",
  desc: ""
});

const onSubmit = () => {
  console.log("submit!");
};
</script>
