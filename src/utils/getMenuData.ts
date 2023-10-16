import type { MenuDataItem } from "./typings";

const data: MenuDataItem[] = [
  {
    name: "招标须知",
    key: "1",
    icon: "ico1",
    iconClassName: "ico1",
    path: "/client/home",
  },
  {
    name: "招标竞价",
    key: "2",
    icon: "ico2",
    iconClassName: "ico2",
    path: "/client/bid",
    children: [
      {
        name: "正在招标中",
        key: "21",
        path: "/client/bid/in_progress",
      },
      {
        name: "即将开始",
        key: "22",
        path: "/client/bid/in_preparation",
      },
      {
        name: "己结束",
        key: "23",
        path: "/client/bid/finished",
      },
      {
        name: "已中止",
        key: "24",
        path: "/client/bid/terminated",
      },
      {
        name: "全部产品",
        key: "25",
        path: "/client/bid/all",
      },
    ],
  },
  {
    name: "新品推荐",
    key: "product",
    icon: "ico3",
    iconClassName: "ico3",
    path: "/client/product",
  },
  {
    name: "我的",
    key: "4",
    icon: "ico4",
    iconClassName: "ico4",
    path: "/client/account",
    children: [
      {
        name: "我的招标",
        key: "41",
        path: "/client/account/my-bid",
      },
      {
        name: "企业信息管理",
        key: "42",
        path: "/client/account/manage-company",
      },
      {
        name: "个人信息管理",
        key: "43",
        path: "/client/account/edit-profile",
      },
    ],
  },
  {
    name: "联系我们",
    key: "5",
    icon: "ico5",
    iconClassName: "ico5",
    path: "/client/contact",
  },
];

const getMenuData = (productMenu: any[]): MenuDataItem[] => {
  const productChildren = productMenu.map((item) => ({
    name: item.Title,
    key: `product-${item.Id}`,
    path: `/client/product/${item.Id}`,
  }));
  return data.map((item) => {
    if (item.key === "product") {
      return {
        ...item,
        children: productChildren,
      };
    }
    return item;
  });
};

export { getMenuData };
