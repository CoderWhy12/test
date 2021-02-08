import request from "@/utils/story/request";

/**
 * 获取当前登录用户库权限
 * @param authCode          权限
 * @returns {AxiosPromise}
 */
export function getUserLibraryListFromLibraryAuth(authCode = "C_ADD") {
  return request({
    url: "/user_auth/getUserLibraryListFromLibraryAuth",
    method: "get",
    params: { authCode }
  });
}
