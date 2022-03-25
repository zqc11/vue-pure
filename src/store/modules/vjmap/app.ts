import { defineStore } from "pinia";
import { APP_ID_KEY } from "./keys";
import vjmap, { GeoPoint } from "vjmap";

export const defaultServiceUrl = "https://vjmap.com/server/api/v1";
export const defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6MiwiVXNlcm5hbWUiOiJhZG1pbjEiLCJOaWNrTmFtZSI6ImFkbWluMSIsIkF1dGhvcml0eUlkIjoiYWRtaW4iLCJCdWZmZXJUaW1lIjo4NjQwMCwiZXhwIjoxOTQyMzg5NTc0LCJpc3MiOiJ2am1hcCIsIm5iZiI6MTYyNzAyODU3NH0.VQchVXxgjl5aCp3j3Uf5U2Mpk1NJNirH62Ys-8XOfnY";

export interface ViewPortInfo {
  mapId: string;
  version: string;
  id: string;
  name: string;
  darkTheme: boolean;
  imgSrc: string;
  centerX: number;
  centerY: number;
  zoom: number;
  bearing: number;
  pitch: number;
}

export interface AnnotataionInfo extends ViewPortInfo {
  pt1: GeoPoint;
  pt2: GeoPoint;
  width: number;
  height: number;
  svg: string;
  json: string;
}

// const myLocalStorage: Storage = {
//   //  localStorage 和 sessionStorage有5M左右的大小限制，如果保存过多会导致失败,这里重写下，导常捕捉下
//   setItem(key, state) {
//     try {
//       return localStorage.setItem(key, state);
//     } catch (error) {
//       console.error(error);
//     }
//   },
//   getItem(key) {
//     return localStorage.getItem(key);
//   },
//   length: localStorage.length,
//   clear: function (): void {
//     localStorage.clear();
//   },
//   key: function (index: number): string | null {
//     return localStorage.key(index);
//   },
//   removeItem: function (key: string): void {
//     return localStorage.removeItem(key);
//   }
// };

export const useAppStore = defineStore({
  id: APP_ID_KEY,
  state: () => {
    return {
      lightTheme: false,
      serviceUrl: defaultServiceUrl,
      accessToken: defaultAccessToken,
      curMapId: "sys_zp",
      curVersion: "",
      mapInfos: {},
      myMapIds: [], // 我上传的图形
      myViewPorts: {}, // 我保存的视口信息
      myAnnotataions: {}, // 我保存的批注信息
      annoIdDivOverlay: {}, // 批注id与divOverlay对应表
      dataDisplayIdName: {}, // 数据展示保存时id和名称对应表
      snapQueryLimit: 10000, // 捕捉查询时最多返回的数目
      showNavigationControl: true, // 显示导航条控件
      showMousePositionControl: true, // 显示鼠标位置控件
      showMapExportControl: true // 显示地图导出控件
    };
  },
  actions: {
    setTheme(light: boolean) {
      this.lightTheme = light;
    },
    setCurMapIdVer(mapid: string, version?: string) {
      this.curMapId = mapid;
      this.curVersion = version ?? "";
    },
    getVerInfo(prefix?: string) {
      let v = "";
      if (this.curVersion != "v1") {
        v = this.curVersion ?? "";
      }
      if (v) {
        return prefix + v;
      } else {
        return "";
      }
    },
    saveViewPort(viewInfo: ViewPortInfo) {
      const key = `${viewInfo.mapId}_${viewInfo.version}`;
      const viewPorts = this.myViewPorts as any;
      viewPorts[key] = viewPorts[key] || [];
      viewInfo.id = viewInfo.id || vjmap.RandomID();
      viewPorts[key].push(viewInfo);
    },
    removeViewPort(mapId: string, version: string, id: string) {
      const key = `${mapId}_${version}`;
      const viewPorts = this.myViewPorts as any;
      viewPorts[key] = viewPorts[key] || [];
      viewPorts[key].splice(
        viewPorts[key].findIndex((item: ViewPortInfo) => item.id === id),
        1
      );
    },
    saveAnnotataion(annoInfo: AnnotataionInfo) {
      const key = `${annoInfo.mapId}_${annoInfo.version}`;
      const annotataions = this.myAnnotataions as any;
      annotataions[key] = annotataions[key] || [];
      annotataions.id = annotataions.id || vjmap.RandomID();
      const findIdx = annotataions[key].findIndex(
        (item: AnnotataionInfo) => item.id === annotataions.id
      );
      if (findIdx >= 0) {
        // 修改
        annotataions[key][findIdx] = annotataions;
      } else {
        annotataions[key].push(annoInfo);
      }
    },
    removeAnnotataion(mapId: string, version: string, id: string) {
      const key = `${mapId}_${version}`;
      const annotataions = this.myAnnotataions as any;
      annotataions[key] = annotataions[key] || [];
      annotataions[key].splice(
        annotataions[key].findIndex((item: AnnotataionInfo) => item.id === id),
        1
      );
    },
    addMyMapId(mapid: string) {
      const id = mapid as never;
      if (!this.myMapIds.includes(id)) {
        this.myMapIds.push(id);
      }
    },
    addDataDisplayIdName(mapid: string | undefined, id: string, name: string) {
      if (!mapid) return;
      const obj = this.dataDisplayIdName as any;
      obj[mapid] = obj[mapid] || [];
      obj[mapid].push({
        id,
        name
      });
    },
    getDataDisplayIdName(mapid: string) {
      const obj = this.dataDisplayIdName as any;
      return obj[mapid] || [];
    },
    async getMapInfos() {
      try {
        const svc = new vjmap.Service(this.serviceUrl, this.accessToken);
        this.mapInfos = await svc.listMaps("", "*");
      } catch (error) {
        console.error(error);
      }
    }
  }

  /* 示例主要是把数据存localstorge, 实际工程项目中请保存至后台数据库中 */
  // persist: {
  //   enabled: true,
  //   /* 注意， 因为 localStorage 和 sessionStorage有5M左右的大小限制，如果保存过多会导致失败，此示例只是为了演示用法，实际项目请将数据保存至后台*/
  //   strategies: [
  //     {
  //       storage: sessionStorage,
  //       paths: [
  //         "lightTheme",
  //         "myMapIds",
  //         "serviceUrl",
  //         "accessToken",
  //         "snapQueryLimit",
  //         "showNavigationControl",
  //         "showMousePositionControl",
  //         "showMapExportControl",
  //         "dataDisplayIdName"
  //       ]
  //     },
  //     {
  //       storage: myLocalStorage,
  //       paths: ["myViewPorts", "myAnnotataions"]
  //     }
  //   ]
  // }
});
