import request from "@/utils/story/request";

/**
 * 根据素材id批量查询素材数据接口
 * @param ids       素材id
 * @param mediaIds  媒体id
 * @returns {AxiosPromise}
 */
export function searchContentByIds({ ids, mediaIds }) {
  return request({
    url: `/content/search_content_by_ids`,
    method: "post",
    data: { ids, mediaIds }
  });
}

/**
 *检查素材MD5接口
 * @param md5Arr
 * @param returnObj
 * @returns {AxiosPromise}
 */
export function chkExistsList({ md5Arr, returnObj }) {
  return request({
    url: `/content/chkExistsList`,
    method: "post",
    data: { md5Arr, returnObj }
  });
}
