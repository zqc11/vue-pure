import { App } from "vue";
import taskCard from "./src/TaskCard.vue";
import taskInfo from "./src/TaskInfo.vue";
import blueprint from "./src/Blueprint.vue";
import pdf from "./src/PdfView.vue";

export const TaskCard = Object.assign(taskCard, {
  install(app: App) {
    app.component(taskCard.name, taskCard);
  }
});

export const TaskInfo = Object.assign(taskInfo, {
  install(app: App) {
    app.component(taskInfo.name, taskInfo);
  }
});

export const Blueprint = Object.assign(blueprint, {
  install(app: App) {
    app.component(blueprint.name, blueprint);
  }
});

export const PdfView = Object.assign(pdf, {
  install(app: App) {
    app.component(pdf.name, pdf);
  }
});
