import request from "@/utils/request";

//请求样式风格数据
export function getStyleClass(options) {
  return request({
    url: "/style_class/get_by_project",
    method: "get",
    params: options
  });
}

//新增风格样式
export function createNewStyle(options) {
  return request({
    url: "/style_class",
    method: "post",
    data: options
  });
}

//编辑风格样式
export function updateStyle(id, options) {
  return request({
    url: `/style_class/${id}`,
    method: "post",
    data: options
  });
}

//删除风格样式
export function deleteStyle(id) {
  return request({
    url: `/style_class/del/${id}`,
    method: "post"
  });
}

//检查风格所拥有的关系数量
export function getStyleHasCount(options) {
  return request({
    url: `/style_class/has_count`,
    method: "get",
    params: options
  });
}
//获取单个风格
export function getStyleClassForId(id) {
  return request({
    url: `/style_class/${id}`,
    method: "get"
  });
}

//风格发布
export function styleClassOnline(id) {
  return request({
    url: `/style_class/online/${id}`,
    method: "post"
  });
}

//风格撤回
export function styleClassOffline(id) {
  return request({
    url: `/style_class/offline/${id}`,
    method: "post"
  });
}
