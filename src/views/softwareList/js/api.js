import axios from "@axios";

export const softwareList = (params) => {
  return axios.request({
    url: "software_callout/get_software_rule_page",
    method: "get",
    params,
  });
};
