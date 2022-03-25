<template>
  <div class="uploadfile-wrapper">
    <el-upload
      class="upload-demo"
      drag
      accept=".dwg, .dxf, .pdf"
      action="#"
      :auto-upload="false"
      :on-change="onChangeFile"
      v-loading="loading"
      element-loading-text="正在上传,请稍侯..."
      v-if="!isSetting"
    >
      <el-icon class="el-icon--upload" color="#0000ff">
        <upload-filled />
      </el-icon>
      <div class="el-upload__text">
        拖放文件 或
        <em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">支持 AutoCAD 的 dwg 和 dxf 文件类型</div>
      </template>
    </el-upload>
    <div v-else>
      <el-form
        label-width="100px"
        :model="form"
        :rules="rules"
        ref="ruleFormRef"
        v-loading="opening"
        element-loading-text="正在打开图形, 第一次打开时可能需要几十秒至几分钟不等，请稍侯..."
      >
        <el-form-item label="图名称" prop="mapId">
          <el-input v-model="form.mapId" :readonly="!!updateMapId"></el-input>
        </el-form-item>

        <el-form-item>
          <el-tag class="ml-2"
            >以<em>ns_</em>开头的图名称在图形列表中不会显示</el-tag
          >
        </el-form-item>

        <el-form-item label="打开方式">
          <el-radio-group v-model="form.openway">
            <el-radio-button label="直接打开图形"></el-radio-button>
            <el-radio-button label="存储后渲染栅格"></el-radio-button>
            <el-radio-button label="存储后渲染矢量"></el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-tag class="ml-2"
            >如果选择存储后渲染栅格或矢量,第一次打开时由于需要保存几何数据,需耐心等待一段时间。下次打开时会很快打开图形。</el-tag
          >
        </el-form-item>

        <el-form-item>
          <el-tag class="ml-2"
            >如果直接打开图形,不保存几何数据,将不支持一些高级查询功能(除非下次再以存储后渲染栅格或矢量方式形式打开图形)。</el-tag
          >
        </el-form-item>

        <el-form-item>
          <el-tag class="ml-2" type="warning"
            >请不要上传需要保密的图形文件,请及时删除自己的上传的图形！</el-tag
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)"
            >确定</el-button
          >
          <el-button @click="cancelForm(ruleFormRef)">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UploadFilled } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import vjmap, { IOpenMapParam } from "vjmap";
import { useAppStore } from "/@/store/modules/vjmap/app";
import { reactive, ref, onMounted } from "vue";
import { showError } from "/@/utils/ui/ui";

const ruleFormRef = ref();
const loading = ref(false);
const opening = ref(false);
const isSetting = ref(false);

const app = useAppStore();
const router = useRouter();
const route = useRoute();
const form = reactive({
  mapId: "",
  openway: "存储后渲染栅格"
});

const validateName = (rule: any, value: any, callback: any) => {
  let reg = /[0-9A-Za-z_]{2,20}$/;
  if (value.length > 20 || !reg.test(value)) {
    callback(new Error("只能包含字母数字和下划线_，长度2-20"));
  } else {
    callback();
  }
};

const rules = reactive({
  mapId: [
    {
      required: true,
      message: "请输入图名称",
      trigger: "blur"
    },
    { validator: validateName, trigger: "blur" }
  ]
});

let fileid = ""; // 文件ID
let uploadname = ""; // 上传的文件名
let updateMapId = ref(""); // 更新的图名称
let svc = new vjmap.Service(app.serviceUrl, app.accessToken);

onMounted(() => {
  if (route.query?.mapid) updateMapId.value = route.query.mapid as string;
});

const onChangeFile = async (file: any) => {
  if (!file) return;
  loading.value = true; // 准备上传
  try {
    let res = await svc.uploadMap(file.raw);
    loading.value = false; // 上传成功
    isSetting.value = true;
    if (updateMapId.value) {
      form.mapId = updateMapId.value;
    } else {
      form.mapId = res.mapid;
    }

    fileid = res.fileid;
    uploadname = res.uploadname;
  } catch (error) {
    loading.value = false; // 上传失败
    showError("上传图形失败!", error);
  }
};

const submitForm = (formEl: any) => {
  if (!formEl) return;
  formEl.validate((valid: boolean) => {
    if (valid) {
      openUpdateMap();
    } else {
      showError("上传图形失败!");
      return false;
    }
  });
};

const openUpdateMap = async () => {
  opening.value = true;
  try {
    let mapopenway =
      form.openway === "直接打开图形"
        ? vjmap.MapOpenWay.Memory
        : vjmap.MapOpenWay.GeomRender;
    let res: IOpenMapParam = {
      mapid: form.mapId,
      fileid: fileid,
      uploadname: uploadname,
      mapopenway
    };
    let data;
    if (updateMapId.value) {
      // 如果传了图名称，是更新图形
      data = await svc.updateMap(res);
    } else {
      // 新建图形
      data = await svc.openMap(res);
    }
    opening.value = false;
    if (data.error) {
      showError("打开图形失败!", data.error);
    } else {
      app.addMyMapId(form.mapId); // 保存我上存的图形ID
      let isVector = form.openway === "存储后渲染矢量" ? "true" : "false";
      goMap(form.mapId, mapopenway, isVector);
    }
  } catch (error) {
    opening.value = false;
    showError("打开图形错误!", error);
  }
};

const goMap = (mapid: string, mapopenway: string, vector: string) => {
  router.push({
    path: "/map/" + mapid,
    query: {
      mapopenway,
      vector
    }
  });
};

const cancelForm = (formEl: any) => {
  if (!formEl) return;
  formEl.resetFields();
  isSetting.value = false;
};
</script>

<style scoped>
.uploadfile-wrapper {
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

:deep .el-upload-dragger {
  border: 1px dashed #2b47e7 !important;
}
</style>
