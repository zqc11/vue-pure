import type { App } from "vue";
import { createPinia } from "pinia";
// 使用Pinia代替Vuex
/* Pinia 优势
符合直觉，易于学习
极轻， 仅有 1 KB
模块化设计，便于拆分状态 */
const store = createPinia();

export function setupStore(app: App<Element>) {
  app.use(store);
}

export { store };
