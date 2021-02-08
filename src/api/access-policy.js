import request from "@/utils/request";

//获取访问策略列表
export function getAccessPolicyList(query) {
  return request({
    url: "/access-policy/list",
    method: "get",
    params: query,
  });
}
//获取访问日志
export function getAccessPolicyLog(query) {
  return request({
    url: "/access-policy/log",
    method: "get",
    params: query,
  });
}
