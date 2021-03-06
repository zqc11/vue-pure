/*
 * mpetroff/print-maps
 * https://github.com/mpetroff/print-maps
 *
 * I used the source code from the above repository. Thanks so much!
 *
 * -----LICENSE------
 * Print Maps - High-resolution maps in the browser, for printing
 * Copyright (c) 2015-2020 Matthew Petroff
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import vjmap, { Map } from "vjmap";
import { fabric } from "fabric";
import loadImage from "blueimp-load-image";

export const Format = {
  JPEG: "jpg",
  PNG: "png",
  PDF: "pdf",
  SVG: "svg"
} as const;
type Format = typeof Format[keyof typeof Format];

export const Unit = {
  in: "in",
  mm: "mm"
} as const;
type Unit = typeof Unit[keyof typeof Unit];

export const Size = {
  A2: [594, 420],
  A3: [420, 297],
  A4: [297, 210],
  A5: [210, 148],
  A6: [148, 105],
  B2: [707, 500],
  B3: [500, 353],
  B4: [353, 250],
  B5: [250, 176],
  B6: [176, 125]
};
type Size = [number, number];

export const PageOrientation = {
  Landscape: "landscape",
  Portrait: "portrait"
} as const;
type PageOrientation = typeof PageOrientation[keyof typeof PageOrientation];

export const DPI = {
  72: 72,
  96: 96,
  200: 200,
  300: 300,
  400: 400
} as const;
type DPI = typeof DPI[keyof typeof DPI];

export default class MapGenerator {
  private map: Map;

  private width: number;

  private height: number;

  private dpi: number;

  private format: string;

  private unit: Unit;

  private backgroundColor: string;

  /**
   * Constructor
   * @param map Map object
   * @param size layout size. default is A4
   * @param dpi dpi value. deafult is 300
   * @param format image format. default is PNG
   * @param unit length unit. default is mm
   */
  constructor(
    map: Map,
    size?: Size,
    dpi?: number,
    format?: string,
    unit?: Unit,
    backgroundColor?: string
  ) {
    this.map = map;
    this.width = size ? size[0] : Size.A4[0];
    this.height = size ? size[1] : Size.A4[1];
    this.dpi = dpi || 300;
    this.format = format || Format.PNG.toString();
    this.unit = unit || Unit.mm;
    this.backgroundColor = backgroundColor || "";
  }

  _createRenderMap(container: HTMLDivElement) {
    // Render map
    const renderMap = new Map({
      container,
      center: this.map.getCenter(),
      zoom: this.map.getZoom(),
      bearing: this.map.getBearing(),
      pitch: this.map.getPitch(),
      interactive: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
      attributionControl: false,
      // hack to read transfrom request callback function
      transformRequest: (this.map as any)._requestManager._transformRequestFn
    });
    const style = this.map.getStyle();

    if (style && style.sources) {
      const sources = style.sources;
      Object.keys(sources).forEach(name => {
        const newSrc = this.map.getSource(name);
        const src = sources[name];
        Object.keys(src).forEach(key => {
          // @ts-ignore
          if (!src[key]) delete src[key];
          if (
            key == "tiles" &&
            // @ts-ignore
            Array.isArray(newSrc["tiles"]) &&
            newSrc["tiles"].length == 1 &&
            // @ts-ignore
            Array.isArray(src["tiles"]) &&
            src["tiles"].length == 1 &&
            // @ts-ignore
            newSrc["tiles"][0] != src["tiles"][0]
          ) {
            // ???????????????
            // @ts-ignore
            src[key] = newSrc[key];
          }
        });
      });
    }

    // ??????????????????????????????????????????
    if (this.backgroundColor && style.layers) {
      style.layers = [
        {
          id: "background" + vjmap.RandomID(),
          type: "background",
          paint: { "background-color": this.backgroundColor }
        },
        ...style.layers
      ];
    }

    renderMap.setStyle(style);
    return renderMap;
  }

  async toBase64(maxWidth: number) {
    return new Promise((resolve, _reject) => {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const this_ = this;

      // Calculate pixel ratio
      const actualPixelRatio: number = window.devicePixelRatio;
      Object.defineProperty(window, "devicePixelRatio", {
        get() {
          return this_.dpi / 96;
        }
      });
      // Create map container
      const hidden = document.createElement("div");
      hidden.className = "hidden-map";
      document.body.appendChild(hidden);
      const container = document.createElement("div");
      container.style.width = this.toPixels(this.width);
      container.style.height = this.toPixels(this.height);
      hidden.appendChild(container);

      const renderMap = this._createRenderMap(container);

      renderMap.once("idle", () => {
        const canvas = renderMap.getCanvas();
        const img = loadImage.scale(canvas, {
          maxWidth
        });
        const res = img.toDataURL("image/png");
        renderMap.remove();
        hidden.parentNode?.removeChild(hidden);
        Object.defineProperty(window, "devicePixelRatio", {
          get() {
            return actualPixelRatio;
          }
        });
        resolve(res);
      });
    });
  }

  /**
   * Generate and download Map image
   */
  generate() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const this_ = this;

    // Calculate pixel ratio
    const actualPixelRatio: number = window.devicePixelRatio;
    Object.defineProperty(window, "devicePixelRatio", {
      get() {
        return this_.dpi / 96;
      }
    });
    // Create map container
    const hidden = document.createElement("div");
    hidden.className = "hidden-map";
    document.body.appendChild(hidden);
    const container = document.createElement("div");
    container.style.width = this.toPixels(this.width);
    container.style.height = this.toPixels(this.height);
    hidden.appendChild(container);

    const renderMap = this._createRenderMap(container);

    renderMap.once("idle", () => {
      const canvas = renderMap.getCanvas();
      const fileName = `map.${this_.format}`;
      switch (this_.format) {
        case Format.PNG:
          this_.toPNG(canvas, fileName);
          break;
        case Format.JPEG:
          this_.toJPEG(canvas, fileName);
          break;
        case Format.PDF:
          this_.toPDF(renderMap, fileName);
          break;
        case Format.SVG:
          this_.toSVG(canvas, fileName);
          break;
        default:
          console.error(`Invalid file format: ${this_.format}`);
          break;
      }

      renderMap.remove();
      hidden.parentNode?.removeChild(hidden);
      Object.defineProperty(window, "devicePixelRatio", {
        get() {
          return actualPixelRatio;
        }
      });
    });
  }

  /**
   * Convert canvas to PNG
   * @param canvas Canvas element
   * @param fileName file name
   */
  private toPNG(canvas: HTMLCanvasElement, fileName: string) {
    canvas.toBlob(blob => {
      // @ts-ignore
      saveAs(blob, fileName);
    });
  }

  /**
   * Convert canvas to JPEG
   * @param canvas Canvas element
   * @param fileName file name
   */
  private toJPEG(canvas: HTMLCanvasElement, fileName: string) {
    const uri = canvas.toDataURL("image/jpeg", 0.85);
    const a = document.createElement("a");
    a.href = uri;
    a.download = fileName;
    a.click();
    a.remove();
  }

  /**
   * Convert Map object to PDF
   * @param map Map object
   * @param fileName file name
   */
  private toPDF(map: Map, fileName: string) {
    const canvas = map.getCanvas();
    const pdf = new jsPDF({
      orientation: this.width > this.height ? "l" : "p",
      unit: this.unit,
      compress: true
    });

    pdf.addImage(
      canvas.toDataURL("image/png"),
      "png",
      0,
      0,
      this.width,
      this.height,
      undefined,
      "FAST"
    );

    const { lng, lat } = map.getCenter();
    pdf.setProperties({
      title: map.getStyle().name,
      subject: `center: [${lng}, ${lat}], zoom: ${map.getZoom()}`,
      creator: "VjMap Export Plugin",
      author: "(c)vjmap"
    });

    pdf.save(fileName);
  }

  /**
   * Convert canvas to SVG
   * this SVG export is using fabric.js. It is under experiment.
   * Please also see their document.
   * http://fabricjs.com/docs/
   * @param canvas Canvas element
   * @param fileName file name
   */
  private toSVG(canvas: HTMLCanvasElement, fileName: string) {
    const uri = canvas.toDataURL("image/png");
    fabric.Image.fromURL(uri, (image: any) => {
      const tmpCanvas = new fabric.Canvas("canvas");
      const pxWidth = Number(
        this.toPixels(this.width, this.dpi).replace("px", "")
      );
      const pxHeight = Number(
        this.toPixels(this.height, this.dpi).replace("px", "")
      );
      image.scaleToWidth(pxWidth);
      image.scaleToHeight(pxHeight);

      tmpCanvas.add(image);
      const svg = tmpCanvas.toSVG({
        // @ts-ignore
        x: 0,
        y: 0,
        width: pxWidth,
        height: pxHeight,
        viewBox: {
          x: 0,
          y: 0,
          width: pxWidth,
          height: pxHeight
        }
      });
      const a = document.createElement("a");
      a.href = `data:application/xml,${encodeURIComponent(svg)}`;
      a.download = fileName;
      a.click();
      a.remove();
    });
  }

  /**
   * Convert mm/inch to pixel
   * @param length mm/inch length
   * @param conversionFactor DPI value. default is 96.
   */
  private toPixels(length: number, conversionFactor = 96) {
    if (this.unit === Unit.mm) {
      conversionFactor /= 25.4;
    }
    return `${conversionFactor * length}px`;
  }
}
