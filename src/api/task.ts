import { http } from "../utils/http";

export const getTasks = id => {
  return http.get("/flowTask/" + id);
};

export const blueprints = files => {
  console.log(files);
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
