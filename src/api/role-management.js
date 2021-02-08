import request from "@/utils/request";
//角色列表
export function getPage(options) {
  return request({
    url: "/role-management/getPage",
    method: "get",
    params: options,
  });
}

//策略
export function getStrategy(options) {
  return request({
    url: `/role-management/getStrategy`,
    method: "get",
    params: options,
  });
}
