import request from "@/utils/request";

export function list(query) {
  return request({
    url: "/resources/list",
    method: "get",
    params: query,
  });
}
