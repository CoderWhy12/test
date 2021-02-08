import request from "@/utils/request";

//获取计算机列表
export function getComputerList(query) {
  return request({
    url: "/computer/list",
    method: "get",
    params: query,
  });
}

//获取日志
export function getComputerLog(query) {
  return request({
    url: "/computer/log",
    method: "get",
    params: query,
  });
}
