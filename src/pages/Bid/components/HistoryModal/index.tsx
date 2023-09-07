import { Modal, Table } from "antd";
import moment from "moment";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Paging, usePaging } from "../../../../components";
import { getBidHistory } from "../../../../services/bid";
import "./index.less";

type EmailInviteModalProps = {
  visible: boolean;
  onCancel: () => void;
  companyName?: string;
  myPrice?: number;
};

const EmailInviteModal: FC<EmailInviteModalProps> = (props) => {
  const { visible, onCancel, companyName, myPrice } = props;
  const { id } = useParams<{ id: string }>();
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [historyData, setHistoryData] = useState<any[]>();

  const pagingInfo = usePaging();
  const { pageOffset, pageSize, setTotalCount } = pagingInfo;

  useEffect(() => {
    setHistoryLoading(true);
    getBidHistory({
      Id: Number(id),
      page: pageOffset,
      pagesize: pageSize,
    })
      .then((res) => {
        if (res.state) {
          setHistoryData(res.data);
          setTotalCount(res?.total);
        }
      })
      .finally(() => setHistoryLoading(false));
  }, [id, visible, pageSize, pageOffset, setTotalCount]);

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
      title={`${companyName} 历史出价记录`}
      width={692}
      wrapClassName="mailInvitationModal"
      open={visible}
      footer={null}
      onCancel={onCancel}
    >
      <div>
        我司的当前出价为 <strong>¥{myPrice}</strong>
      </div>
      <Table
        loading={historyLoading}
        dataSource={historyData}
        columns={columns}
        pagination={false}
        size="small"
      />
      <Paging pagingInfo={pagingInfo} size="small" />
    </Modal>
  );
};

export default EmailInviteModal;
