import { http } from "../utils/http";

export const getTasks = id => {
  return http.get("/flowTask/" + id);
};

export const uploadFiles = files => {
  return http.post(
    "/multiUpload",
    { files: files },
    {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "multipart/form-data",
        "X-Requested-With": "XMLHttpRequest"
      }
    }
  );
};
