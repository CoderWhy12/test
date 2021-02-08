import request from "@/utils/request";

//获取动态口令列表
export function getDynamicPsw(query) {
  return request({
    url: "/dynamic-psw/list",
    method: "get",
    params: query,
  });
}
