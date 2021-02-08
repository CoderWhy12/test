import request from "@/utils/request";
//系统参数列表
export function getPage(options) {
  return request({
    url: "/sys-param/getPage",
    method: "get",
    params: options,
  });
}
//获取系统参数备份列表
export function getRestorePage(options) {
  return request({
    url: "/sys-param/getRestorePage",
    method: "get",
    params: options,
  });
}
