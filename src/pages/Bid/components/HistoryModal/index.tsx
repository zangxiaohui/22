import { Modal, Statistic, Table } from "antd";
import moment from "moment";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePaging } from "../../../../components";
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

  const pagingInfo = usePaging(100);
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
      render: (text: number) => <Statistic value={text} prefix="¥" />,
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
      wrapClassName="modal-wrap"
      destroyOnClose
      title={`${companyName ?? ""} 历史出价记录`}
      width={692}
      open={visible}
      footer={null}
      onCancel={onCancel}
    >
      <Statistic
        title="我司的当前出价为"
        value={myPrice}
        prefix="¥"
        className="history-my-price"
      />
      <Table
        className="history-table"
        loading={historyLoading}
        dataSource={historyData}
        columns={columns}
        pagination={false}
        size="small"
      />
      {/* <Paging pagingInfo={pagingInfo} /> */}
    </Modal>
  );
};

export default EmailInviteModal;
