import axios from "@axios";

export const softwareList = (params) => {
  return axios.request({
    url: "software_callout/get_software_rule_page",
    method: "get",
    params,
  });
};

// 上传文件信息
export const offlineJson = (data) => {
  return axios.request({
    url: "software_callout/get_offline_json",
    method: "post",
    data,
    responseType: "blob",
  });
};
