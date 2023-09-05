import { Modal, Table } from "antd";
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
    setHistoryLoading(true);
    getBidHistory({
      Id: Number(id),
    }).then((res) => {
      setHistoryLoading(false);
      setHistoryData(res?.data);
    });
  }, [id]);

  const columns = [
    {
      title: "出价记录",
      dataIndex: "key1",
    },
    {
      title: "出价时间",
      dataIndex: "2",
    },
    {
      title: "操作人",
      dataIndex: "2",
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
