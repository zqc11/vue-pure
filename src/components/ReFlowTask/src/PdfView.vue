<template>
  <div class="pdf-container">
    <!--此处根据pdf的页数动态生成相应数量的canvas画布-->
    <canvas
      v-for="pageIndex in pdfPages"
      :id="`pdf-canvas-` + pageIndex"
      :key="pageIndex"
      class="pdf-canvas"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import * as PdfJs from "pdfjs-dist/legacy/build/pdf.js";
import { nextTick, ref, onMounted } from "vue";
import Pdf from "/js2.pdf";
let pdfDoc: any = ""; // 保存加载的pdf文件流
let pdfPages = ref(0); // pdf文件的页数
let pdfScale = ref(2.0); // 缩放比例

onMounted(() => {
  loadFile(Pdf);
});

// 载入pdf文件
function loadFile(url: string): void {
  PdfJs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";
  const loadingTask = PdfJs.getDocument(url);
  loadingTask.promise.then(pdf => {
    pdfDoc = pdf;
    pdfPages.value = pdfDoc.numPages;
    nextTick(() => {
      renderPage(1); // 表示渲染第 1 页
    });
  });
}

// 将页面渲染到指定块中
function renderPage(num: any) {
  pdfDoc.getPage(num).then((page: any) => {
    const canvasId = "pdf-canvas-" + num; // 第num个canvas画布的id
    const canvas: any = document.getElementById(canvasId);
    const ctx: any = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const bsr =
      ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio ||
      1;
    const ratio = dpr / bsr;
    const viewport = page.getViewport({ scale: pdfScale.value });
    canvas.width = viewport.width * ratio;
    canvas.height = viewport.height * ratio;
    canvas.style.width = viewport.width + "px";
    canvas.style.height = viewport.height + "px";
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };
    page.render(renderContext);
    // 在第num页渲染完毕后，递归调用renderPage方法，去渲染下一页，直到所有页面渲染完毕为止
    if (num < pdfPages.value) {
      renderPage(num + 1);
    }
  });
}
</script>

<style scoped>
.pdf-canvas {
  width: 100% !important;
  height: auto !important;
}
</style>
