const statusOptions = [
  { id: null, name: "标注状态" },
  { id: 1, name: "已标注" },
  { id: 2, name: "未标注" },
];
const filterOptions = [
  { id: 0, name: "不过滤" },
  { id: 1, name: "浏览器" },
  { id: 2, name: "邮箱客户端" },
];

const supportOptions = [
  { name: "支持", id: 1 },
  { name: "不支持", id: 0 },
];
const leakTypeOptions = [
  { id: 0, name: "不泄密" },
  { id: 1, name: "浏览器" },
  { id: 2, name: "邮件客户端" },
  { id: 3, name: "网盘" },
];

const paymentOptions = [
  { id: 1, name: "免费" },
  { id: 2, name: "收费" },
  { id: 3, name: "订阅" },
  { id: 4, name: "增值" },
];
const positiveOptions = [
  { id: 1, name: "积极" },
  { id: 3, name: "较积极" },
  { id: 5, name: "中性" },
  { id: 7, name: "较消极" },
  { id: 9, name: "消极" },
];
export {
  statusOptions,
  filterOptions,
  supportOptions,
  leakTypeOptions,
  paymentOptions,
  positiveOptions,
};
