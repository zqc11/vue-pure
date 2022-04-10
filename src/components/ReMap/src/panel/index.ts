import { App } from "vue";
import annotation from "./Annotation.vue";
import layerManage from "./LayerManage.vue";
import property from "./Property.vue";
import viewPort from "./ViewPort.vue";

export const Annotation = Object.assign(annotation, {
  install(app: App) {
    app.component(annotation.name, annotation);
  }
});

export const LayerManage = Object.assign(layerManage, {
  install(app: App) {
    app.component(layerManage.name, layerManage);
  }
});

export const Property = Object.assign(property, {
  install(app: App) {
    app.component(property.name, property);
  }
});

export const ViewPort = Object.assign(viewPort, {
  install(app: App) {
    app.component(viewPort.name, viewPort);
  }
});
