import { http } from "../utils/http";

export const getTasks = id => {
  return http.get("/flowTask/" + id);
};

export const uploadFiles = files => {
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
