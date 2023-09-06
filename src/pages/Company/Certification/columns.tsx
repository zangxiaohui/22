import type { ColumnsType } from "antd/es/table";

export const columns: ColumnsType<any> = [
  {
    title: "资质名称",
    key: "order_number",
    dataIndex: "order_number",
  },
  {
    title: "查看证书",
    dataIndex: "email",
    key: "email",
    render: (text) => text ?? "-",
  },
];
