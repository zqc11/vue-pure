import { http } from "../utils/http";

export const getTasks = id => {
  return http.get("/flowTask/" + id);
};

export const blueprints = files => {
  return http.request("post", "/multiUpload", {
    data: {
      files: files
    },
    headers: {
      "Content-Type": "multipart/form-data;boundary=----------webkeijfklsd"
    }
  });
};

export const postTask = data => {
  return http.request("post", "/flowTask/saveTask", {
    data
  });
};

export const getPdfFile = filename => {
  return http.request("get", "/getPdfFile/" + filename);
};

export const saveBlueprintDrawData = data => {
  return http.request("post", "/saveDrawData", { data });
};

export const getBlueprintDrawData = id => {
  return http.request("get", "getDrawData/" + id);
};

export const saveBlueprintSnapData = data => {
  return http.request("post", "/saveSnapData", { data });
};

export const getBlueprintSnapData = id => {
  return http.request("get", "getSnapData/" + id);
};

export const saveFormData = data => {
  return http.request("post", "/flowTask/saveFormData", { data });
};

export const getFlowTemplate = () => {
  return http.get("/getAllFlowTemplate");
};
