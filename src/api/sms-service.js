import request from "@/utils/request";

//获取短信服务列表
export function getSmsServiceList(query) {
  return request({
    url: "/sms-service/list",
    method: "get",
    params: query,
  });
}
