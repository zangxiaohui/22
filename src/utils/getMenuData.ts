import type { MenuDataItem } from "./typings";

const data: MenuDataItem[] = [
  {
    name: "招标须知",
    key: "1",
    icon: "1223",
  },
  {
    name: "招标竞价",
    key: "2",
    children: [
      {
        name: "全部产品",
        key: "21",
      },
      {
        name: "即将开始",
        key: "22",
      },
      {
        name: "正在招标中",
        key: "23",
      },
      {
        name: "己结束",
        key: "24",
      },
      {
        name: "已中止",
        key: "25",
      },
    ],
  },
  {
    name: "新品推荐",
    key: "3",
  },
  {
    name: "我的",
    key: "4",
  },
  {
    name: "联系我们",
    key: "5",
  },
];

const getMenuData = (): MenuDataItem[] => {
  return data;
};

export { getMenuData };
