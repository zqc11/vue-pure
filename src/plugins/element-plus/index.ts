import { App, Component } from "vue";
import {
  ElTag,
  ElAffix,
  ElSkeleton,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElScrollbar,
  ElSubMenu,
  ElButton,
  ElCol,
  ElRow,
  ElSpace,
  ElSteps,
  ElStep,
  ElDivider,
  ElCard,
  ElDropdown,
  ElDialog,
  ElMenu,
  ElMenuItem,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  ElInput,
  ElForm,
  ElFormItem,
  ElSelect,
  ElOption,
  ElPopover,
  ElPopper,
  ElTooltip,
  ElDrawer,
  ElPagination,
  ElAlert,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElDescriptions,
  ElDescriptionsItem,
  ElBacktop,
  ElSwitch,
  ElBadge,
  ElTabs,
  ElTabPane,
  ElAvatar,
  ElEmpty,
  ElCollapse,
  ElCollapseItem,
  ElTreeV2,
  ElUpload,
  // 指令
  ElLoading,
  ElInfiniteScroll,
  ElCheckboxButton,
  ElCheckbox,
  ElCheckboxGroup,
  ElTimePicker,
  ElSlider,
  ElHeader,
  ElAside,
  ElMain,
  ElContainer,
  ElButtonGroup,
  ElTree,
  ElInputNumber,
  ElMessageBox,
  ElPageHeader
} from "element-plus";

// Directives
const plugins = [ElLoading, ElInfiniteScroll];

const components = [
  ElTag,
  ElAffix,
  ElSkeleton,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElScrollbar,
  ElSubMenu,
  ElButton,
  ElSteps,
  ElStep,
  ElCol,
  ElRow,
  ElSpace,
  ElDivider,
  ElCard,
  ElDropdown,
  ElDialog,
  ElMenu,
  ElMenuItem,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  ElInput,
  ElForm,
  ElFormItem,
  ElSelect,
  ElOption,
  ElPopover,
  ElPopper,
  ElTooltip,
  ElDrawer,
  ElPagination,
  ElAlert,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElDescriptions,
  ElDescriptionsItem,
  ElBacktop,
  ElSwitch,
  ElBadge,
  ElTabs,
  ElTabPane,
  ElAvatar,
  ElEmpty,
  ElCollapse,
  ElCollapseItem,
  ElTreeV2,
  ElUpload,
  ElCheckboxButton,
  ElCheckbox,
  ElCheckboxGroup,
  ElTimePicker,
  ElSlider,
  ElHeader,
  ElAside,
  ElMain,
  ElContainer,
  ElButtonGroup,
  ElTree,
  ElInputNumber,
  ElMessageBox,
  ElPageHeader
];

export function useElementPlus(app: App) {
  // 注册组件
  components.forEach((component: Component) => {
    app.component(component.name, component);
  });
  // 注册指令
  plugins.forEach(plugin => {
    // @ts-ignore
    app.use(plugin);
  });
}
