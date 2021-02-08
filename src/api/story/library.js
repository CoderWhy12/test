import request from "@/utils/story/request";

/**
 * 通过id获取库
 * @param ids
 * @returns {AxiosPromise}
 */
export function getByIds(ids) {
  return request({
    url: "/library/get_by_ids",
    method: "get",
    params: { ids }
  });
}
