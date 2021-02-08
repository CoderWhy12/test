import request from "@/utils/request";

//请求项目列表数据
export function getProject() {
  return request({
    url: "/project",
    method: "get"
  });
}

//添加项目列表数据
export function createProject(options) {
  return request({
    url: "/project",
    method: "post",
    data: options
  });
}

//根据项目id删除项目
export function deleteProjectById(id) {
  return request({
    url: `/project/del/${id}`,
    method: "post"
  });
}

//检查项目所拥有的关系数量
export function getProjectHasCount(options) {
  return request({
    url: `/project/has_count`,
    method: "get",
    params: options
  });
}

//根据项目id编辑项目
export function updateProject(id, options) {
  return request({
    url: `/project/${id}`,
    method: "post",
    data: options
  });
}

//获取项目风格树
export function getProjectStyleClassTree() {
  return request({
    url: `/project/get_project_style_class_tree`,
    method: "get"
  });
}
//获取单个项目
export function getProjectForId(id) {
  return request({
    url: `/project/${id}`,
    method: "get"
  });
}
