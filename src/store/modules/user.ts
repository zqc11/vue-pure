import { defineStore } from "pinia";
import { store } from "/@/store";
import { ResultType, userType } from "./types";
import { getLogin, refreshToken } from "/@/api/user";
import { storageLocal, storageSession } from "/@/utils/storage";
import { getToken, setToken, removeToken } from "/@/utils/auth";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";

const data = getToken();
let token = "";
let account = "";
if (data) {
  const dataJson = JSON.parse(data);
  if (dataJson) {
    token = dataJson?.accessToken;
    account = dataJson?.account ?? "admin";
  }
}

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    token,
    account
  }),
  actions: {
    SET_TOKEN(token) {
      this.token = token;
    },
    SET_NAME(account) {
      this.account = account;
    },
    // 登入
    loginByUsername(data): Promise<ResultType> {
      return new Promise((resolve, reject) => {
        getLogin(data)
          .then((response: ResultType) => {
            if (response.success && response.data != null) {
              setToken(response.data);
            }
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 登出 清空缓存
    logOut() {
      this.token = "";
      this.account = "";
      removeToken();
      storageLocal.clear();
      storageSession.clear();
      useMultiTagsStoreHook().handleTags("equal", [
        {
          path: "/welcome",
          parentPath: "/",
          meta: {
            title: "首页",
            icon: "home-filled"
          }
        }
      ]);
    },
    // 刷新token
    async refreshToken(data) {
      return refreshToken(data).then(data => {
        if (data) {
          setToken(data);
          return data;
        }
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
