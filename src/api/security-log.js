import request from "@/utils/request";

//获取列表
export function list(options) {
  return request({
    url: "/security-log/list",
    method: "get",
    params: options,
  });
}
