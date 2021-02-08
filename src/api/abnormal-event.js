import request from "@/utils/request";

//获取异常事件列表
export function getAbnormalEventList(query) {
  return request({
    url: "/abnormal-event/list",
    method: "get",
    params: query,
  });
}

//获取异常事件条件
export function getAbnormalEventCondition(query) {
  return request({
    url: "/abnormal-event/condition",
    method: "get",
    params: query,
  });
}
