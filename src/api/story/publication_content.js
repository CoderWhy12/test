import request from "@/utils/story/request";

//根据id获取稿件数据接口
export function getPublicationContent(id) {
  return request({
    url: `/nav_publish/get_publication_content/${id}`,
    method: "get"
  });
}

//查询稿件素材附档接口
export function getRelationList(id) {
  return request({
    url: `/nav_publish/getRelationList/${id}`,
    method: "get"
  });
}
