import { joinPaths } from "urijs";
import request from "@/utils/story/request";


const UPLOAD_URL = "/media_upload/new";

export function getUploadUrl(libId) {
  return joinPaths(UPLOAD_URL, libId + "").toString();
}

// 保存data-uri
export function newWechatImgByDataUri(options) {
  return request({
    url: `/media_upload/newWechatImgByDataUri`,
    method: "post",
    data: options
  });
}