import { IControl, Map } from "vjmap";
import CrosshairManager from "./auxiliary-line-mgr";
import PrintableAreaManager from "./print-mgr";
import MapGenerator, {
  Size,
  Format,
  PageOrientation,
  DPI,
  Unit
} from "./generator";

type Options = {
  PageSize?: any;
  PageOrientation?: string;
  Format?: string;
  DPI?: number;
  Crosshair?: boolean;
  PrintableArea?: boolean;
};

/**
 * Map Export Control.
 * @param {Object} targets - Object of layer.id and title
 */
export default class MapExportControl implements IControl {
  private controlContainer?: HTMLElement;

  private exportContainer!: HTMLElement;

  private crosshair: CrosshairManager | undefined;

  private printableArea: PrintableAreaManager | undefined;

  private map?: Map;

  private exportButton!: HTMLButtonElement;

  private options: Options = {
    PageSize: Size.A4,
    PageOrientation: PageOrientation.Landscape,
    Format: Format.PDF,
    DPI: DPI[300],
    Crosshair: true,
    PrintableArea: true
  };

  constructor(options?: Options) {
    if (options) {
      this.options = Object.assign(this.options, options);
    }
    this.onDocumentClick = this.onDocumentClick.bind(this);
  }

  public getDefaultPosition(): string {
    const defaultPosition = "top-right";
    return defaultPosition;
  }

  public onAdd(map: Map): HTMLElement {
    this.map = map;
    this.controlContainer = document.createElement("div");
    this.controlContainer.classList.add("vjmapgis-ctrl");
    this.controlContainer.classList.add("vjmapgis-ctrl-group");
    this.exportContainer = document.createElement("div");
    this.exportContainer.classList.add("vjmapgis-export-list");
    this.exportButton = document.createElement("button");
    this.exportButton.classList.add("vjmapgis-ctrl-icon");
    this.exportButton.classList.add("vjmapgis-export-control");
    this.exportButton.type = "button";
    this.exportButton.style.backgroundImage = `url('data:image/svg+xml;charset=UTF-8,<svg id="Capa_1" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><g><path d="m422.5 99v-24c0-41.355-33.645-75-75-75h-184c-41.355 0-75 33.645-75 75v24z"/><path d="m118.5 319v122 26 15c0 16.568 13.431 30 30 30h214c16.569 0 30-13.432 30-30v-15-26-122zm177 128h-80c-8.284 0-15-6.716-15-15s6.716-15 15-15h80c8.284 0 15 6.716 15 15s-6.716 15-15 15zm0-64h-80c-8.284 0-15-6.716-15-15s6.716-15 15-15h80c8.284 0 15 6.716 15 15s-6.716 15-15 15z"/><path d="m436.5 129h-361c-41.355 0-75 33.645-75 75v120c0 41.355 33.645 75 75 75h13v-80h-9c-8.284 0-15-6.716-15-15s6.716-15 15-15h24 304 24c8.284 0 15 6.716 15 15s-6.716 15-15 15h-9v80h14c41.355 0 75-33.645 75-75v-120c0-41.355-33.645-75-75-75zm-309 94h-48c-8.284 0-15-6.716-15-15s6.716-15 15-15h48c8.284 0 15 6.716 15 15s-6.716 15-15 15z"/></g></svg>')`;
    this.exportButton.style.backgroundPosition = "center";
    this.exportButton.style.backgroundRepeat = "no-repeat";
    this.exportButton.style.backgroundSize = "70%";
    this.exportContainer.style.display = "none";
    this.exportButton.addEventListener("click", () => {
      this.exportButton.style.display = "none";
      this.exportContainer.style.display = "block";
      this.toggleCrosshair(true);
      this.togglePrintableArea(true);
    });
    document.addEventListener("click", this.onDocumentClick);
    this.controlContainer.appendChild(this.exportButton);
    this.controlContainer.appendChild(this.exportContainer);

    const table = document.createElement("TABLE");
    table.className = "print-table";

    const tr1 = this.createSelection(
      Size,
      "页面尺寸",
      "page-size",
      this.options.PageSize,
      (data: any, key: any) => JSON.stringify(data[key])
    );
    table.appendChild(tr1);

    const tr2 = this.createSelection(
      PageOrientation,
      "页面方向",
      "page-orientaiton",
      this.options.PageOrientation,
      (data: any, key: any) => data[key]
    );
    table.appendChild(tr2);

    const tr3 = this.createSelection(
      Format,
      "导出格式",
      "format-type",
      this.options.Format,
      (data: any, key: any) => data[key]
    );
    table.appendChild(tr3);

    const tr4 = this.createSelection(
      DPI,
      "分辨率DPI",
      "dpi-type",
      this.options.DPI,
      (data: any, key: any) => data[key]
    );
    table.appendChild(tr4);

    this.exportContainer.appendChild(table);

    const generateButton = document.createElement("button");
    generateButton.type = "button";
    generateButton.textContent = "导出";
    generateButton.classList.add("generate-button");
    generateButton.addEventListener("click", () => {
      const pageSize: HTMLSelectElement = <HTMLSelectElement>(
        document.getElementById("vjmap-export-page-size")
      );
      const pageOrientation: HTMLSelectElement = <HTMLSelectElement>(
        document.getElementById("vjmap-export-page-orientaiton")
      );
      const formatType: HTMLSelectElement = <HTMLSelectElement>(
        document.getElementById("vjmap-export-format-type")
      );
      const dpiType: HTMLSelectElement = <HTMLSelectElement>(
        document.getElementById("vjmap-export-dpi-type")
      );
      const orientValue = pageOrientation.value;
      let pageSizeValue = JSON.parse(pageSize.value);
      if (orientValue === PageOrientation.Portrait) {
        pageSizeValue = pageSizeValue.reverse();
      }
      let backgroundColor = "";
      if (this.map?.getService()?.currentMapParam()?.darkMode) {
        // 深色主题
        backgroundColor = "#022B4F"; //'black'
      }
      const mapGenerator = new MapGenerator(
        map,
        pageSizeValue,
        Number(dpiType.value),
        formatType.value,
        Unit.mm,
        backgroundColor
      );
      mapGenerator.generate();
    });
    this.exportContainer.appendChild(generateButton);

    return this.controlContainer;
  }

  private createSelection(
    data: Object,
    title: string,
    type: string,
    defaultValue: any,
    converter: Function
  ): HTMLElement {
    const label = document.createElement("label");
    label.textContent = title;

    const content = document.createElement("select");
    content.setAttribute("id", `vjmap-export-${type}`);
    content.style.width = "100%";
    Object.keys(data).forEach(key => {
      const optionLayout = document.createElement("option");
      optionLayout.setAttribute("value", converter(data, key));
      optionLayout.appendChild(document.createTextNode(key));
      optionLayout.setAttribute("name", type);
      if (defaultValue === (data as any)[key]) {
        optionLayout.selected = true;
      }
      content.appendChild(optionLayout);
    });
    content.addEventListener("change", () => {
      this.updatePrintableArea();
    });

    const tr1 = document.createElement("TR");
    const tdLabel = document.createElement("TD");
    const tdContent = document.createElement("TD");
    tdLabel.appendChild(label);
    tdContent.appendChild(content);
    tr1.appendChild(tdLabel);
    tr1.appendChild(tdContent);
    return tr1;
  }

  public onRemove(): void {
    if (
      !this.controlContainer ||
      !this.controlContainer.parentNode ||
      !this.map ||
      !this.exportButton
    ) {
      return;
    }
    this.exportButton.removeEventListener("click", this.onDocumentClick);
    this.controlContainer.parentNode.removeChild(this.controlContainer);
    document.removeEventListener("click", this.onDocumentClick);

    if (this.crosshair !== undefined) {
      this.crosshair.destroy();
      this.crosshair = undefined;
    }

    this.map = undefined;
  }

  private onDocumentClick(event: MouseEvent): void {
    if (
      this.controlContainer &&
      !this.controlContainer.contains(event.target as Element) &&
      this.exportContainer &&
      this.exportButton
    ) {
      this.exportContainer.style.display = "none";
      this.exportButton.style.display = "block";
      this.toggleCrosshair(false);
      this.togglePrintableArea(false);
    }
  }

  private toggleCrosshair(state: boolean) {
    if (this.options.Crosshair === true) {
      if (state === false) {
        if (this.crosshair !== undefined) {
          this.crosshair.destroy();
          this.crosshair = undefined;
        }
      } else {
        this.crosshair = new CrosshairManager(this.map);
        this.crosshair.create();
      }
    }
  }

  private togglePrintableArea(state: boolean) {
    if (this.options.PrintableArea === true) {
      if (state === false) {
        if (this.printableArea !== undefined) {
          this.printableArea.destroy();
          this.printableArea = undefined;
        }
      } else {
        this.printableArea = new PrintableAreaManager(this.map);
        this.updatePrintableArea();
      }
    }
  }

  private updatePrintableArea() {
    if (this.printableArea === undefined) {
      return;
    }
    const pageSize: HTMLSelectElement = <HTMLSelectElement>(
      document.getElementById("vjmap-export-page-size")
    );
    const pageOrientation: HTMLSelectElement = <HTMLSelectElement>(
      document.getElementById("vjmap-export-page-orientaiton")
    );
    const orientValue = pageOrientation.value;
    let pageSizeValue = JSON.parse(pageSize.value);
    if (orientValue === PageOrientation.Portrait) {
      pageSizeValue = pageSizeValue.reverse();
    }
    this.printableArea.updateArea(pageSizeValue[0], pageSizeValue[1]);
  }
}
