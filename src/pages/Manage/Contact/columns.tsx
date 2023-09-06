import type { ColumnsType } from "antd/es/table";

export enum ContactReviewType {
  UN_REVIEW = 0,
  REVIEWED = 1,
}

export const ContactReviewTypeMap = {
  [ContactReviewType.UN_REVIEW]: {
    label: "待审核",
    color: "#CF2B2B",
  },
  [ContactReviewType.REVIEWED]: {
    label: "已审核",
    color: "#00B58C",
  },
};

export const columns: ColumnsType<any> = [
  {
    title: "姓名",
    key: "CusLxr_RealName",
    dataIndex: "CusLxr_RealName",
  },
  {
    title: "手机号",
    dataIndex: "CusLxr_Phone",
    key: "CusLxr_Phone",
  },
  {
    title: "邮箱",
    key: "CusLxr_Email",
    dataIndex: "CusLxr_Email",
  },
  {
    title: "状态",
    dataIndex: "CusLxr_State",
    key: "CusLxr_State",
    render: (text: ContactReviewType) => {
      return (
        <span style={{ color: ContactReviewTypeMap[text]?.color }}>
          {ContactReviewTypeMap[text]?.label}
        </span>
      );
    },
  },
];
