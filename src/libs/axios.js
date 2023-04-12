import Vue from "vue";
// axios
import axios from "axios";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

const axiosIns = axios.create({
  // You can add your headers here
  // ================================
  // baseURL: "http://192.168.1.146:5789/",
  baseURL: "http://192.168.1.163:8878/",
  // baseURL: 'https://some-domain.com/api/',
  // timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
});

axiosIns.interceptors.request.use(
  (config) => {
    const accessToken = window.localStorage.getItem("token");
    if (accessToken) {
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosIns.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("error:", error);
    if (error.response && error.response.data.status === 407) {
      toast("XCircleIcon", "danger", error.response.data.message);
    }
    if (error.response && error.response.status === 500) {
      return Promise.reject(error.response.data.message);
    }
    if (error.response && error.response.status === 403) {
      return Promise.reject(error.response.data.message);
    }
    if (error.response && error.response.status === 401) {
      window.localStorage.removeItem("accessToken");
      if (!window.localStorage.getItem("accessToken")) {
        router.push({ name: "/login", params: { cause: 401 } });
      }
    }
    return Promise.reject(error);
  }
);

function toast(icon, variant, text) {
  Vue.$toast({
    component: ToastificationContent,
    position: "top-right",
    props: {
      title: "提示：",
      icon,
      variant,
      text,
    },
  });
}

Vue.prototype.$http = axiosIns;

export default axiosIns;
