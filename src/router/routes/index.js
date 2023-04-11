export default [
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
];
