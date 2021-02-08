import request from "@/utils/request";

//获取模板列表List
export function getTemplateList(options) {
  return request({
    url: `/template`,
    method: "get",
    params: options
  });
}

//复制模板
export function copyTemplate(options) {
  return request({
    url: `/template`,
    method: "post",
    data: options
  });
}
//模板发布
export function templateOnline(id) {
  return request({
    url: `/template/online/${id}`,
    method: "post"
  });
}
//模板撤回
export function templateOffline(id) {
  return request({
    url: `/template/offline/${id}`,
    method: "post"
  });
}
//查询单个模板
export function getTempForId(id) {
  return request({
    url: `/template/${id}`,
    method: "get"
  });
}
//更新模板
export function updateTemp(id, options) {
  return request({
    url: `/template/${id}`,
    method: "post",
    data: options
  });
}
//删除模板
export function deleteTemp(id) {
  return request({
    url: `/template/del/${id}`,
    method: "post"
  });
}
