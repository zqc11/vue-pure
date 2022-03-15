<template>
  <div>
    <!--     <el-divider direction="horizontal"></el-divider> -->
    <Splitpanes class="default-theme">
      <Pane v-show="showForm()" :size="width" :min-size="minSizeOfForm">
        <!-- 显示表单信息 -->
        <el-scrollbar height="80vh">
          <v-form-render
            :form-json="formJson"
            :form-data="formData"
            :option-data="optionData"
            ref="vFormRef"
          >
          </v-form-render>
          <el-button type="primary" @click="submitForm">Submit</el-button>
        </el-scrollbar>
      </Pane>
      <Pane
        v-show="showBlueprint()"
        :size="width"
        :min-size="minSizeOfBlueprint"
      >
        <el-scrollbar height="80vh">
          <!-- 显示机械图纸 -->
          <Blueprint></Blueprint>
          <PdfView></PdfView>
        </el-scrollbar>
      </Pane>
    </Splitpanes>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, Ref, ref, reactive } from "vue";
import { Blueprint, PdfView } from "/@/components/ReFlowTask";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import { ElMessage } from "element-plus";
let show = inject<Ref>("show");
let width = computed(() => {
  if (show.value == 1 || show.value == 2) {
    return 100;
  }
  return 50;
});
function showForm() {
  return show.value != 2;
}
function showBlueprint() {
  return show.value != 1;
}
let minSizeOfForm = computed(() => {
  if (show.value == 1) {
    return 100;
  }
  if (show.value == 2) {
    return 0;
  }
  return 20;
});
let minSizeOfBlueprint = computed(() => {
  if (show.value == 1) {
    return 0;
  }
  if (show.value == 2) {
    return 100;
  }
  return 20;
});

// =====================
const formJson = reactive({
  widgetList: [
    {
      type: "static-text",
      icon: "static-text",
      formItemFlag: false,
      options: {
        name: "statictext111193",
        columnWidth: "200px",
        hidden: false,
        textContent: "单列表单",
        customClass: [],
        onCreated: "",
        onMounted: "",
        label: "static-text"
      },
      id: "statictext111193"
    },
    {
      type: "divider",
      icon: "divider",
      formItemFlag: false,
      options: {
        name: "divider102346",
        label: "",
        columnWidth: "200px",
        direction: "horizontal",
        contentPosition: "center",
        hidden: false,
        customClass: [],
        onCreated: "",
        onMounted: ""
      },
      id: "divider102346"
    },
    {
      type: "input",
      icon: "text-field",
      formItemFlag: true,
      options: {
        name: "input12931",
        label: "发件人姓名",
        labelAlign: "",
        type: "text",
        defaultValue: "",
        placeholder: "",
        columnWidth: "200px",
        size: "",
        labelWidth: null,
        labelHidden: false,
        readonly: false,
        disabled: false,
        hidden: false,
        clearable: true,
        showPassword: false,
        required: true,
        validation: "",
        validationHint: "",
        customClass: [],
        labelIconClass: null,
        labelIconPosition: "rear",
        labelTooltip: null,
        minLength: null,
        maxLength: null,
        showWordLimit: false,
        prefixIcon: "",
        suffixIcon: "",
        appendButton: false,
        appendButtonDisabled: false,
        buttonIcon: "el-icon-search",
        onCreated: "",
        onMounted: "",
        onInput: "",
        onChange: "",
        onFocus: "",
        onBlur: "",
        onValidate: ""
      },
      id: "input12931"
    },
    {
      type: "switch",
      icon: "switch-field",
      formItemFlag: true,
      options: {
        name: "switch96070",
        label: "是否保密",
        labelAlign: "",
        defaultValue: true,
        columnWidth: "200px",
        labelWidth: null,
        labelHidden: false,
        disabled: false,
        hidden: false,
        customClass: "",
        labelIconClass: null,
        labelIconPosition: "rear",
        labelTooltip: null,
        switchWidth: 40,
        activeText: "",
        inactiveText: "",
        activeColor: null,
        inactiveColor: null,
        onCreated: "",
        onMounted: "",
        onChange: "",
        onValidate: ""
      },
      id: "switch96070"
    },
    {
      type: "input",
      icon: "text-field",
      formItemFlag: true,
      options: {
        name: "input23031",
        label: "发件人号码",
        labelAlign: "",
        type: "text",
        defaultValue: "",
        placeholder: "",
        columnWidth: "200px",
        size: "",
        labelWidth: null,
        labelHidden: false,
        readonly: false,
        disabled: false,
        hidden: false,
        clearable: true,
        showPassword: false,
        required: true,
        validation: "",
        validationHint: "",
        customClass: "",
        labelIconClass: null,
        labelIconPosition: "rear",
        labelTooltip: null,
        minLength: null,
        maxLength: null,
        showWordLimit: false,
        prefixIcon: "",
        suffixIcon: "",
        appendButton: false,
        appendButtonDisabled: false,
        buttonIcon: "el-icon-search",
        onCreated: "",
        onMounted: "",
        onInput: "",
        onChange: "",
        onFocus: "",
        onBlur: "",
        onValidate: ""
      },
      id: "input23031"
    },
    {
      type: "textarea",
      icon: "textarea-field",
      formItemFlag: true,
      options: {
        name: "textarea21654",
        label: "发件人地址",
        labelAlign: "",
        rows: 3,
        defaultValue: "",
        placeholder: "",
        columnWidth: "200px",
        size: "",
        labelWidth: null,
        labelHidden: false,
        readonly: false,
        disabled: false,
        hidden: false,
        required: true,
        validation: "",
        validationHint: "",
        customClass: "",
        labelIconClass: null,
        labelIconPosition: "rear",
        labelTooltip: null,
        minLength: null,
        maxLength: null,
        showWordLimit: false,
        onCreated: "",
        onMounted: "",
        onInput: "",
        onChange: "",
        onFocus: "",
        onBlur: "",
        onValidate: ""
      },
      id: "textarea21654"
    },
    {
      type: "divider",
      icon: "divider",
      formItemFlag: false,
      options: {
        name: "divider69240",
        label: "",
        columnWidth: "200px",
        direction: "horizontal",
        contentPosition: "center",
        hidden: false,
        customClass: "",
        onCreated: "",
        onMounted: ""
      },
      id: "divider69240"
    },
    {
      type: "input",
      icon: "text-field",
      formItemFlag: true,
      options: {
        name: "input113152",
        label: "收件人姓名",
        labelAlign: "",
        type: "text",
        defaultValue: "",
        placeholder: "",
        columnWidth: "200px",
        size: "",
        labelWidth: null,
        labelHidden: false,
        readonly: false,
        disabled: false,
        hidden: false,
        clearable: true,
        showPassword: false,
        required: true,
        validation: "",
        validationHint: "",
        customClass: [],
        labelIconClass: null,
        labelIconPosition: "rear",
        labelTooltip: null,
        minLength: null,
        maxLength: null,
        showWordLimit: false,
        prefixIcon: "",
        suffixIcon: "",
        appendButton: false,
        appendButtonDisabled: false,
        buttonIcon: "el-icon-search",
        onCreated: "",
        onMounted: "",
        onInput: "",
        onChange: "",
        onFocus: "",
        onBlur: "",
        onValidate: ""
      },
      id: "input113152"
    },
    {
      type: "input",
      icon: "text-field",
      formItemFlag: true,
      options: {
        name: "input40240",
        label: "收件人号码",
        labelAlign: "",
        type: "text",
        defaultValue: "",
        placeholder: "",
        columnWidth: "200px",
        size: "",
        labelWidth: null,
        labelHidden: false,
        readonly: false,
        disabled: false,
        hidden: false,
        clearable: true,
        showPassword: false,
        required: true,
        validation: "",
        validationHint: "",
        customClass: "",
        labelIconClass: null,
        labelIconPosition: "rear",
        labelTooltip: null,
        minLength: null,
        maxLength: null,
        showWordLimit: false,
        prefixIcon: "",
        suffixIcon: "",
        appendButton: false,
        appendButtonDisabled: false,
        buttonIcon: "el-icon-search",
        onCreated: "",
        onMounted: "",
        onInput: "",
        onChange: "",
        onFocus: "",
        onBlur: "",
        onValidate: ""
      },
      id: "input40240"
    },
    {
      type: "input",
      icon: "text-field",
      formItemFlag: true,
      options: {
        name: "input78584",
        label: "收件人地址",
        labelAlign: "",
        type: "text",
        defaultValue: "",
        placeholder: "",
        columnWidth: "200px",
        size: "",
        labelWidth: null,
        labelHidden: false,
        readonly: false,
        disabled: false,
        hidden: false,
        clearable: true,
        showPassword: false,
        required: true,
        validation: "",
        validationHint: "",
        customClass: "",
        labelIconClass: null,
        labelIconPosition: "rear",
        labelTooltip: null,
        minLength: null,
        maxLength: null,
        showWordLimit: false,
        prefixIcon: "",
        suffixIcon: "",
        appendButton: false,
        appendButtonDisabled: false,
        buttonIcon: "el-icon-search",
        onCreated: "",
        onMounted: "",
        onInput: "",
        onChange: "",
        onFocus: "",
        onBlur: "",
        onValidate: ""
      },
      id: "input78584"
    },
    {
      type: "divider",
      icon: "divider",
      formItemFlag: false,
      options: {
        name: "divider75887",
        label: "",
        columnWidth: "200px",
        direction: "horizontal",
        contentPosition: "center",
        hidden: false,
        customClass: [],
        onCreated: "",
        onMounted: ""
      },
      id: "divider75887"
    },
    {
      type: "slider",
      icon: "slider-field",
      formItemFlag: true,
      options: {
        name: "slider54714",
        label: "价格保护",
        labelAlign: "",
        columnWidth: "200px",
        size: "",
        labelWidth: null,
        labelHidden: false,
        disabled: false,
        hidden: false,
        required: false,
        validation: "",
        validationHint: "",
        customClass: [],
        labelIconClass: null,
        labelIconPosition: "rear",
        labelTooltip: null,
        min: 0,
        max: 100,
        step: 10,
        range: false,
        height: null,
        onCreated: "",
        onMounted: "",
        onChange: "",
        onValidate: "",
        showStops: true
      },
      id: "slider54714"
    },
    {
      type: "textarea",
      icon: "textarea-field",
      formItemFlag: true,
      options: {
        name: "textarea64794",
        label: "其他信息",
        labelAlign: "",
        rows: 3,
        defaultValue: "",
        placeholder: "",
        columnWidth: "200px",
        size: "",
        labelWidth: null,
        labelHidden: false,
        readonly: false,
        disabled: false,
        hidden: false,
        required: false,
        validation: "",
        validationHint: "",
        customClass: "",
        labelIconClass: null,
        labelIconPosition: "rear",
        labelTooltip: null,
        minLength: null,
        maxLength: null,
        showWordLimit: false,
        onCreated: "",
        onMounted: "",
        onInput: "",
        onChange: "",
        onFocus: "",
        onBlur: "",
        onValidate: ""
      },
      id: "textarea64794"
    }
  ],
  formConfig: {
    modelName: "formData",
    refName: "vForm",
    rulesName: "rules",
    labelWidth: 150,
    labelPosition: "left",
    size: "",
    labelAlign: "label-right-align",
    cssCode: "",
    customClass: [],
    functions: "",
    layoutType: "PC",
    jsonVersion: 3,
    onFormCreated: "",
    onFormMounted: "",
    onFormDataChange: ""
  }
});
const formData = reactive({});
const optionData = reactive({});
const vFormRef = ref(null);

const submitForm = () => {
  vFormRef.value
    .getFormData()
    .then(formData => {
      // Form Validation OK
      alert(JSON.stringify(formData));
    })
    .catch(error => {
      // Form Validation failed
      ElMessage.error(error);
    });
};
</script>

<style>
.splitpanes.default-theme .splitpanes__splitter {
  background-color: #fff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
  -ms-flex-negative: 0;
  flex-shrink: 0;
}

.default-theme.splitpanes--vertical > .splitpanes__splitter,
.default-theme .splitpanes--vertical > .splitpanes__splitter {
  width: 15px;
  border-left: 2px solid #bbb;
  margin-left: -1px;
}
</style>