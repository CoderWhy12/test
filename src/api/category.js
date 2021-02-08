import request from "../utils/request";

//获取标题
// export function getProTit() {
//   return request.request({
//     url: "/proTit",
//     method: "get"
//   });
// }
export function getCategoryTree() {
  return request.request({
    url: "/category/tree",
    method: "get"
  });
}
// export function getMaterialList() {
//   return request.request({
//     baseURL: "http://192.168.10.29:3000/",
//     url: "/materialList",
//     method: "get"
//   });
// }
//获取左侧工具栏
// export function getCategoryTree() {
//   return request.request({
//     url: "/asideMenu",
//     method: "get"
//   });
// }
