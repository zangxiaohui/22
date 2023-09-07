import type { ColumnsType } from "antd/es/table";

export const columns: ColumnsType<any> = [
  {
    title: "提货物料",
    key: "PropmTh_Thwl",
    dataIndex: "PropmTh_Thwl",
  },
  {
    title: "提货时间",
    dataIndex: "PropmTh_ThTime",
    key: "PropmTh_ThTime",
  },
  {
    title: "车牌号",
    key: "PropmTh_ThCarNo",
    dataIndex: "PropmTh_ThCarNo",
  },
  {
    title: "司机姓名",
    key: "PropmTh_Lxr",
    dataIndex: "PropmTh_Lxr",
  },
  {
    title: "联系方式",
    key: "PropmTh_Phone",
    dataIndex: "PropmTh_Phone",
  },
  {
    title: "起始地点",
    key: "PropmTh_BAddress",
    dataIndex: "PropmTh_BAddress",
  },
];
