import request from "@/utils/request";

export function getTreeContainer() {
  return request({
    url: `/tree/container`,
    method: "get",
  });
}
