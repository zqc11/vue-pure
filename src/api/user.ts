import { http } from "../utils/http";

interface userType extends Promise<any> {
  svg?: string;
  code?: number;
  info?: object;
}

// 获取验证码
export const getVerify = (): userType => {
  return http.request("get", "/captcha");
};

// 登录
export const getLogin = (data: object) => {
  return http.request("post", "/login", { data });
};

// 刷新token
export const refreshToken = (data: object) => {
  return http.request("post", "/refreshToken", { data });
};

// 加载统计数据
export const getStatistics = id => {
  return http.get("/operationLog/" + id);
};

export const getFriends = id => {
  return http.get("/friends/" + id);
};

export const getUserById = id => {
  return http.get("/user/" + id);
};
