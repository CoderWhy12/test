import request from "@/utils/request";

export function login(data) {
  return request({
    url: "/vue-element-admin/user/login",
    method: "post",
    data,
  });
}

export function getInfo(token) {
  return request({
    url: "/vue-element-admin/user/info",
    method: "get",
    params: { token },
  });
}

export function logout() {
  return request({
    url: "/vue-element-admin/user/logout",
    method: "post",
  });
}

export function list(query) {
  return request({
    url: "/vue-element-admin/user/list",
    method: "get",
    params: query,
  });
}

//获取用户日志
export function getUserLog(query) {
  return request({
    url: "/vue-element-admin/user/log",
    method: "get",
    params: query,
  });
}
