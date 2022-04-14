import { App } from "vue";
import control from "./src/Control.vue";
import nodePanel from "./src/NodePanel.vue";
import dataDialog from "./src/DataDialog.vue";
import nodeDrawer from "./src/NodeDrawer.vue";
import edgeDrawer from "./src/EdgeDrawer.vue";
import flowTemplateDrawer from "./src/FlowTemplateDrawer.vue";

export const Control = Object.assign(control, {
  install(app: App) {
    app.component(control.name, control);
  }
});

export const NodePanel = Object.assign(nodePanel, {
  install(app: App) {
    app.component(nodePanel.name, nodePanel);
  }
});

export const DataDialog = Object.assign(dataDialog, {
  install(app: App) {
    app.component(dataDialog.name, dataDialog);
  }
});

export const NodeDrawer = Object.assign(nodeDrawer, {
  install(app: App) {
    app.component(nodeDrawer.name, nodeDrawer);
  }
});

export const EdgeDrawer = Object.assign(edgeDrawer, {
  install(app: App) {
    app.component(edgeDrawer.name, edgeDrawer);
  }
});

export const FlowTemplateDrawer = Object.assign(flowTemplateDrawer, {
  install(app: App) {
    app.component(flowTemplateDrawer.name, flowTemplateDrawer);
  }
});
