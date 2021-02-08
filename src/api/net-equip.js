import request from "@/utils/request";

export function list(query) {
  return request({
    url: "/net-equip/list",
    method: "get",
    params: query,
  });
}
//获取某个的日志
export function getLogo(options) {
  return request({
    url: `/net-equip/getLogo`,
    method: "get",
    params: options,
  });
}
