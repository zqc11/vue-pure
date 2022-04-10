import DataDisplay from "~/views/Dialog/dataDisplay.vue";
import { dialog } from "../dialog";
import { Map } from "vjmap";

export const showDataDisplayDlg = async (map: Map) => {
  await dialog({
    is: DataDisplay,
    props: {
      map: map
    },
    showBtn: false
  });
};

export const getShowRandomData = async (_map: Map) => {};
