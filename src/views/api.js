import axios from "@axios";

export const smsCode = (params) => {
  return axios.request({
    url: "api/account/get_sms_code",
    method: "get",
    params,
  });
};

// 获取验证码信息
export const tokenInfo = (params) => {
  return axios.request({
    url: "api/account/get_token",
    method: "get",
    params,
  });
};

// 获取身份信息
export const userInfo = () => {
  return axios.request({
    url: "api/account/userinfo",
    method: "get",
  });
};
