import type { App } from "vue";
import SvgIcon from "./SvgIcon.vue";

const components = [SvgIcon];

const install = (app: App): void => {
  components.forEach(component => {
    app.component(component.name, component);
  });
};

export default install;
