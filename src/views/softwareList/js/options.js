const payOptions = [
  { id: 1, name: "免费" },
  { id: 2, name: "收费" },
  { id: 3, name: "订阅" },
  { id: 4, name: "增值" },
];

const lvOptions = [
  { id: 1, name: "积极" },
  { id: 3, name: "较积极" },
  { id: 5, name: "中性" },
  { id: 7, name: "较消极" },
  { id: 9, name: "消极" },
];

const flowOptions = [
  { id: 0, name: "不过滤" },
  { id: 1, name: "浏览器" },
  { id: 2, name: "邮箱客户端" },
];

const leakTypeOptions = [
  { id: 0, name: "不泄密" },
  { id: 1, name: "浏览器" },
  { id: 2, name: "邮件客户端" },
  { id: 3, name: "网盘" },
];

const supportOptions = [
  { text: "支持", value: 1 },
  { text: "不支持", value: 0 },
];
export { payOptions, lvOptions, flowOptions, leakTypeOptions, supportOptions };