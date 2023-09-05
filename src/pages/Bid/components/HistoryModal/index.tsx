import { Modal, Table } from "antd";
import moment from "moment";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBidHistory } from "../../../../services/bid";
import "./index.less";

type EmailInviteModalProps = {
  visible: boolean;
  onCancel: () => void;
};

const EmailInviteModal: FC<EmailInviteModalProps> = (props) => {
  const { visible, onCancel } = props;
  const { id } = useParams<{ id: string }>();
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [historyData, setHistoryData] = useState<any[]>();

  useEffect(() => {
    if (visible) {
      setHistoryLoading(true);
      getBidHistory({
        Id: Number(id),
      }).then((res) => {
        setHistoryLoading(false);
        setHistoryData(res?.data);
      });
    }
  }, [id, visible]);

  const columns = [
    {
      title: "出价记录",
      dataIndex: "PropmBjLog_Price",
    },
    {
      title: "出价时间",
      dataIndex: "PropmBjLog_AddTime",
      render: (text: string) => moment(text).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "操作人",
      dataIndex: "Lxr",
    },
  ];

  return (
    <Modal
      destroyOnClose
      title="无锡猎豹信息科技有限公司 历史出价记录"
      width={640}
      wrapClassName="mailInvitationModal"
      open={visible}
      footer={null}
      onCancel={onCancel}
    >
      <div>
        我司的当前出价为 <strong>¥8,888,000</strong>
      </div>
      <Table
        loading={historyLoading}
        dataSource={historyData}
        columns={columns}
        pagination={false}
        size="small"
        scroll={{ y: "30vh" }}
      />
    </Modal>
  );
};

export default EmailInviteModal;
