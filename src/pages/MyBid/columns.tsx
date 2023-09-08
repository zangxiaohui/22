import { Badge, Divider, Statistic } from "antd";
import type { ColumnsType } from "antd/es/table";
import { isNil } from "lodash-es";
import moment from "moment";
import { BidType, BidTypeMap } from "../../services/bid";

export const columns: ColumnsType<any> = [
  {
    title: "名称",
    dataIndex: "Propm_Title",
    key: "Propm_Title",
    render: (_, record: any) => {
      return (
        <div>
          {record?.Propm_Title}
          {!isNil(record?.Propm_Count) && <Divider type="vertical" />}
          <span>{record?.Propm_Count}</span>
        </div>
      );
    },
  },
  {
    title: "价格",
    dataIndex: "Propm_CurPrice",
    key: "Propm_CurPrice",
    width: 300,
    render: (text, record: any) => {
      const { State, Propm_CurPrice, Propm_StartPrice, MyPrice } = record || {};
      return (
        <div className="price-cell">
          <Statistic title="起拍价" value={Propm_StartPrice} prefix="¥" />
          {State === BidType.PROCESSING && (
            <Statistic
              className="red"
              title="当前价"
              value={Propm_CurPrice}
              prefix="¥"
            />
          )}
          {State !== BidType.IN_PREPARATION && (
            <Statistic title="我司出价" value={MyPrice} prefix="¥" />
          )}
        </div>
      );
    },
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    render: (_, record) => {
      let rawStatus: BidType = record.State;
      return (
        <Badge
          status={BidTypeMap[rawStatus]?.badgeStatus as any}
          text={
            <span className={BidTypeMap[rawStatus]?.color}>
              {BidTypeMap[rawStatus]?.label}
            </span>
          }
        />
      );
    },
  },
  {
    title: "时间",
    dataIndex: "Propm_EndTime",
    key: "Propm_EndTime",
    width: 300,
    render: (_, record: any) => {
      const { State, Propm_EndTime, Propm_CurEndTime } = record || {};
      const endDate = moment(Propm_EndTime).format("YYYY-MM-DD");
      const endTime = moment(Propm_EndTime).format("HH:mm:ss");
      const text =
        State === BidType.IN_PREPARATION || State === BidType.PROCESSING
          ? "预计"
          : "";
      return (
        <div className="time-cell">
          <div className="time-cell-title">{text}结束时间</div>
          <div className="time-cell-date">{endDate}</div>
          <div className="time-cell-time">{endTime}</div>
        </div>
      );
    },
  },
];
