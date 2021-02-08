import request from "@/utils/request";
import { gen_url } from "@/utils";

//请求素材列表数据
export function getMaterial(options) {
  return request({
    url: "/material",
    method: "get",
    params: options
  });
}

//编辑素材
export function editMaterial(id, options) {
  return request({
    url: `/material/${id}`,
    method: "post",
    data: options
  });
}

//删除素材
export function deleteMaterial(id) {
  return request({
    url: `/material/del/${id}`,
    method: "post"
  });
}

export function getUploadUrl() {
  return gen_url("material/upload");
}

//更新svg
export function updateSvg(options) {
  return request({
    url: `/material/saveByHtml`,
    method: "post",
    data: options
  });
}

// 保存data-uri
export function saveByDataUri(options) {
  return request({
    url: `/material/saveByDataUri`,
    method: "post",
    data: options
  });
}
