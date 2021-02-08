import request from "@/utils/story/request";

/**
 *保存微信稿件接口
 *
 * @returns {AxiosPromise}
 */
export function saveWechat(options) {
  return request({
    url: `/article/saveWechat`,
    method: "post",
    data: options
  });
}
