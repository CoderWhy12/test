import request from "@/utils/request";

//获取白名单列表
export function getWhitelistPage(options) {
  return request({
    url: "/security-policy/whitelist/getPage",
    method: "get",
    params: options,
  });
}

//获取黑名单列表
export function getBlacklistPage(options) {
  return request({
    url: "/security-policy/blacklist/getPage",
    method: "get",
    params: options,
  });
}

//获取密码策略列表
export function getPwdPolicyPage(options) {
  return request({
    url: "/security-policy/pwd-policy/getPage",
    method: "get",
    params: options,
  });
}
