import axios from "@axios";

// 获取进程列表
export const processList = (params) => {
  return axios.request({
    url: "process_callout/get_page_list",
    method: "get",
    params,
  });
};
// 获取软件图标
export const softwareIcon = (params) => {
  return axios.request({
    url: "software_callout/get_icon",
    method: "get",
    params,
  });
};

// 获取进程标注详情
export const processMsg = (params) => {
  return axios.request({
    url: "process_callout/get_process",
    params: {
      name: params.name || "",
      company: params.company || "",
      description: params.description || "",
      product_name: params.product_name || "",
    },
    method: "get",
  });
};

// 软件规则详情页
export const softwareRule = (params) => {
  return axios.request({
    url: "software_callout/get_software_rule_page",
    method: "get",
    params,
  });
};

// 修改进程标注详情
export const updateProcess = (data) => {
  return axios.request({
    url: "process_callout/update_process",
    method: "post",
    data,
  });
};
