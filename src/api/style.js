import request from "@/utils/request";

//获取样式列表List
export function getStyleList(options) {
  return request({
    url: `/style`,
    method: "get",
    params: options
  });
}

//查询单个样式
export function getStyleForId(id) {
  return request({
    url: `/style/${id}`,
    method: "get"
  });
}
//样式列表查询
export function searchStyleList(options) {
  return request({
    url: `/style`,
    method: "get",
    params: options
  });
}
//删除指定样式
export function styleDel(id) {
  return request({
    url: `/style/del/${id}`,
    method: "post"
  });
}
//发布样式
export function styleOnline(id) {
  return request({
    url: `/style/online/${id}`,
    method: "post"
  });
}
//撤回样式
export function styleOffline(id) {
  return request({
    url: `/style/offline/${id}`,
    method: "post"
  });
}
//新增样式
export function addStyle(options) {
  return request({
    url: `/style`,
    method: "post",
    data: options
  });
}
//更新样式
export function updateStyle(id, options) {
  return request({
    url: `/style/${id}`,
    method: "post",
    data: options
  });
}
