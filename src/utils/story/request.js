import axios from "axios";
import { Message } from "element-ui";
import { decrypt, encrypt } from "./encrypt";

const service = axios.create({
  baseURL: process.env.VUE_APP_STORY_API,
  timeout: process.env.VUE_APP_API_TIME_OUT
});

// 请求拦截
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (process.env.VUE_APP_STORY_ENCRYPT) {
      const { data, params } = config;
      if (data) {
        config.data = encrypt(data);
      }
      if (params) {
        config.params = encrypt(params);
      }
    }
    return config;
  },
  error => {
    console.error(error);
    // do something with request error
    return Promise.reject(error);
  }
);

// 响应拦截
service.interceptors.response.use(
  response => {
    const res = process.env.VUE_APP_STORY_ENCRYPT
      ? decrypt(response.data)
      : response.data;
    const { code, msg, data } = res;
    if (code === "success") return data;
    Message({
      message: msg || "Error",
      type: "error",
      duration: process.env.VUE_APP_API_MESSAGE_DURATION
    });
    return Promise.reject(new Error(msg || "Error"));
  },
  error => {
    console.error("err" + error); // for debug
    Message({
      message: error.message,
      type: "error",
      duration: process.env.VUE_APP_API_MESSAGE_DURATION
    });
    return Promise.reject(error);
  }
);

export default service;
