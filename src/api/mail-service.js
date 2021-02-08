import request from "@/utils/request";

//获取短信服务列表
export function getMailServiceList(query) {
  return request({
    url: "/mail-service/list",
    method: "get",
    params: query,
  });
}
