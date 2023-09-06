import type { ColumnsType } from "antd/es/table";

export const columns: ColumnsType<any> = [
  {
    title: "姓名",
    key: "order_number",
    dataIndex: "order_number",
  },
  {
    title: "手机号",
    dataIndex: "email",
    key: "email",
    render: (text) => text ?? "-",
  },
  {
    title: "邮箱",
    key: "order_number",
    dataIndex: "order_number",
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
];
