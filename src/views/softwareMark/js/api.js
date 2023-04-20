import axios from "@axios";

// 获取列表信息
export const softwareList = (params) => {
  return axios.request({
    url: "software_callout/get_page_list",
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

// 获取关联软件规则信息
export const softwareRule = (sync_name, software_sync_id) => {
  return axios.request({
    url: `software_callout/get_matchrules_by_regular?regular=${sync_name}&software_sync_id=${software_sync_id}`,
    method: "post",
    data: {
      regular: sync_name,
      software_sync_id: software_sync_id,
    },
  });
};

// 删除关联软件规则信息
export const delSoftwareRule = (params) => {
  return axios.request({
    url: "software_callout/delete_software",
    method: "post",
    params,
  });
};

// 关联软件规则
export const getRelated = (oneId, twoId) => {
  return axios.request({
    url: `software_callout/related_software_rule?software_sync_id=${oneId}&software_id=${twoId}`,
  });
};
