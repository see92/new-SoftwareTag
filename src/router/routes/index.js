export default [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
    meta: {
      layout: "full",
    },
  },
  {
    path: "/",
    name: "home",
    component: () => import("@/views/Home.vue"),
    meta: {
      pageTitle: "Home",
      breadcrumb: [
        {
          text: "Home",
          active: true,
        },
      ],
    },
  },
  {
    path: "/second-page",
    name: "second-page",
    component: () => import("@/views/SecondPage.vue"),
    meta: {
      pageTitle: "Second Page",
      breadcrumb: [
        {
          text: "Second Page",
          active: true,
        },
      ],
    },
  },
  {
    path: "/processlist",
    name: "processList",
    component: () => import("@/views/processList/index"),
    meta: {
      pageTitle: "进程列表",
      breadcrumb: [{ text: "进程列表", active: true }],
    },
  },
  {
    path: "/softwaremark",
    name: "softwareMark",
    component: () => import("@/views/softwareMark/index"),
    meta: {
      pageTitle: "软件标注",
      breadcrumb: [{ text: "软件标注", active: true }],
    },
  },
  {
    path: "/softwarelist",
    name: "softwareList",
    component: () => import("@/views/softwareList/index"),
    meta: {
      pageTitle: "软件列表",
      breadcrumb: [{ text: "软件列表", active: true }],
    },
  },
  {
    path: "/softwarelist/add",
    name: "softwareListAdd",
    component: () => import("@/views/softwareList/softwareInfo"),
    meta: {
      pageTitle: "添加",
      navActiveLink: "softwareList",
      breadcrumb: [
        { text: "软件列表", to: "/softwareList" },
        { text: "添加", active: true },
      ],
    },
  },
];
