import type { ColumnsType } from "antd/es/table";
import moment from "moment";

export const columns: ColumnsType<any> = [
  {
    title: "名称",
    key: "order_number",
  },
  {
    title: "价格",
    dataIndex: "email",
    key: "email",
    render: (text) => text ?? "-",
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    // render: (_, record) => {
    //   let rawStatus: EmailInvitationStatus = record.status;
    //   if (
    //     record.status === EmailInvitationStatus.SEND_COMPLETE &&
    //     +moment().format('X') >= record.expires_at
    //   ) {
    //     rawStatus = EmailInvitationStatus.EXPIRED;
    //   }
    //   const text = EmailInvitationStatusDisplay[rawStatus];
    //   return text ? <FormattedMessage id={text} /> : '-';
    // },
  },
  {
    title: "时间",
    dataIndex: "joined_at",
    key: "joined_at",
    render: (text) => (text ? moment(text).format("YYYY-MM-DD HH:mm:ss") : "-"),
  },
];
