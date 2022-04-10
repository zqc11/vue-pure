import { App } from "vue";
import mapContainer from "./src/MapContainer.vue";
import cmdBar from "./src/cmdBar.vue";
import sideBar from "./src/sideBar.vue";
import doMapAction from "./src/DoMapAction.vue";
import uiView from "./src/UiView.vue";
import annoBar from "./src/AnnoBar.vue";

export const MapContainer = Object.assign(mapContainer, {
  install(app: App) {
    app.component(mapContainer.name, mapContainer);
  }
});

export const CmdBar = Object.assign(cmdBar, {
  install(app: App) {
    app.component(cmdBar.name, cmdBar);
  }
});

export const SideBar = Object.assign(sideBar, {
  install(app: App) {
    app.component(sideBar.name, sideBar);
  }
});

export const DoMapAction = Object.assign(doMapAction, {
  install(app: App) {
    app.component(doMapAction.name, doMapAction);
  }
});

export const UiView = Object.assign(uiView, {
  install(app: App) {
    app.component(uiView.name, uiView);
  }
});

export const AnnoBar = Object.assign(annoBar, {
  install(app: App) {
    app.component(annoBar.name, annoBar);
  }
});
