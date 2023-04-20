import axios from "@axios";

// 获取软件列表
export const softwareList = (params) => {
  return axios.request({
    url: "software_callout/get_software_rule_page",
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

// 删除软件信息
export const delSoftwareInfo = (params) => {
  return axios.request({
    url: "software_callout/delete_software",
    method: "post",
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

// 获取数据字典表
export const dicClassify = () => {
  return axios.request({
    url: "api/dictionary/get_dictionary_by_code?code=SoftwareClassify",
    method: "get",
  });
};

// 获取软件标签
export const dicTag = () => {
  return axios.request({
    url: "api/dictionary/get_dictionary_by_code?code=SoftwareTags",
    method: "get",
  });
};

// 获取发布者接口
export const publisherList = () => {
  return axios.request({
    url: "software_callout/get_publishers",
    method: "get",
  });
};

// 添加发布者接口
export const AddPublisher = (data) => {
  return axios.request({
    url: "software_callout/add_publisher",
    data,
    method: "post",
  });
};

// 修改发布者接口
export const updatePublisher = (data) => {
  return axios.request({
    url: "software_callout/update_publisher",
    data,
    method: "post",
  });
};

// 删除发布者接口
export const delPublisher = (data) => {
  return axios.request({
    url: "software_callout/delete_publisher?id=" + data.id,
    data,
    method: "post",
  });
};

// 添加软件接口
export const insertSoftware = (data) => {
  return axios.request({
    url: "software_callout/insert_software",
    data,
    method: "post",
  });
};

// 获取单条软件信息
export const softwareInfo = (params) => {
  return axios.request({
    url: "software_callout/get_software",
    method: "get",
    params,
  });
};

// 修改单条软件接口
export const updateSoftware = (data) => {
  return axios.request({
    url: "software_callout/update_software",
    method: "post",
    data,
  });
};

// 获取图片列表
export const iconList = (params) => {
  return axios.request({
    url: "process_callout/get_appicons",
    method: "get",
    params,
  });
};

// 发布者校验规则
export const Check_matchrule = (regular, softwareName) => {
  return axios.request({
    url: `software_callout/check_matchrule?regular=${regular}&software_name=${softwareName}`,
    method: "post",
    data: {
      regular: regular,
      software_name: softwareName,
    },
  });
};
