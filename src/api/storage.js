import request from "../utils/request";

//请求存储数据
export function getStore(options) {
  return request({
    url: "/storage_scheme",
    params: options,
    method: "get"
  });
}
