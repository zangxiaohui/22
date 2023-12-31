import { Modal, Statistic, Table } from "antd";
import classNames from "classnames";
import moment from "moment";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePaging } from "../../../../components";
import { useIsMobile } from "../../../../layouts/RouteContext";
import { getBidHistory } from "../../../../services/bid";
import "./index.less";

type HistoryModalProps = {
  visible: boolean;
  onCancel: () => void;
  companyName?: string;
  myPrice?: number;
};

const HistoryModal: FC<HistoryModalProps> = (props) => {
  const { visible, onCancel, companyName, myPrice } = props;
  const { id } = useParams<{ id: string }>();
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [historyData, setHistoryData] = useState<any[]>();

  const isMobile = useIsMobile();
  const className = classNames("modal-wrap", {
    isMobile: isMobile,
  });

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
      title: "数量",
      dataIndex: "PropmBjLog_Num",
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
      wrapClassName={className}
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

export default HistoryModal;
