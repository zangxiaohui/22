import type { ColumnsType } from "antd/es/table";
import moment from "moment";
import { BidType, BidTypeLabel } from "../../services/bid";

export const columns: ColumnsType<any> = [
  {
    title: "名称",
    dataIndex: "Propm_Title",
    key: "Propm_Title",
  },
  {
    title: "价格",
    dataIndex: "Propm_CurPrice",
    key: "Propm_CurPrice",
    render: (text) => text ?? "-",
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    render: (_, record) => {
      let rawStatus: BidType = record.State;
      return <span>{BidTypeLabel[rawStatus]}</span>;
    },
  },
  {
    title: "时间",
    dataIndex: "Propm_EndTime",
    key: "Propm_EndTime",
    render: (text) => (text ? moment(text).format("YYYY-MM-DD HH:mm:ss") : "-"),
  },
];
