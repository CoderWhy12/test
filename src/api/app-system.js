import request from "@/utils/request";

//获取网络服务列表
export function getPage(options) {
  return request({
    url: "/app-system/getPage",
    method: "get",
    params: options,
  });
}

//获取某个的日志
export function getLogo(options) {
  return request({
    url: `/app-system/getLogo`,
    method: "get",
    params: options,
  });
}
