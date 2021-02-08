import request from "@/utils/story/request";

//获取当前登录用户信息
export function getUserinfo() {
  return request({
    url: "/userinfo",
    method: "get"
  });
}
