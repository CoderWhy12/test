import request from "@/utils/request";

export function getSelectList(options) {
  return request({
    url: `/user-group/select-list`,
    method: "get",
    params: options,
  });
}
