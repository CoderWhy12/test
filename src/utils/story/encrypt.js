import CryptoJS from "crypto-js";

if (!process.env.VUE_APP_STORY_ENCRYPT_KEY)
  console.error(new Error("没有配置稿件中心加密秘钥"));

function encryptData(data) {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    process.env.VUE_APP_STORY_ENCRYPT_KEY
  ).toString();
}
function decryptData(data) {
  try {
    const bytes = CryptoJS.AES.decrypt(
      data,
      process.env.VUE_APP_STORY_ENCRYPT_KEY
    );
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (e) {
    return data;
  }
}

export function encrypt(d) {
  const data = encryptData(d);
  const hmacMd5 = CryptoJS.HmacMD5(data, process.env.VUE_APP_STORY_ENCRYPT_KEY);
  return {
    data,
    hmacMd5: hmacMd5.toString()
  };
}

export function decrypt(result) {
  if (result && result.data) {
    const hmacMd5 = CryptoJS.HmacMD5(
      result.data,
      process.env.VUE_APP_STORY_ENCRYPT_KEY
    );
    if (result.hmacMd5 + "" !== hmacMd5.toString()) {
      result.code = "failed";
      result.msg = "解密失败，数据已被篡改";
      return result;
    }
    result.data = decryptData(result.data);
    return result;
  } else {
    return result;
  }
}
