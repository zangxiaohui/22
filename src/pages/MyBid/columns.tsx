import { Badge, Divider, Statistic } from "antd";
import type { ColumnsType } from "antd/es/table";
import { isNil } from "lodash-es";
import moment from "moment";
import { BidType, BidTypeMap } from "../../services/bid";

export const renderTitle = (record: any = {}) => {
  return (
    <div>
      {record?.Propm_Title}
      {!isNil(record?.Propm_Count) && <Divider type="vertical" />}
      <span>{record?.Propm_Count}</span>
      <span>{record?.Propm_Uint}</span>
    </div>
  );
};

export const renderPrice = (record: any = {}, hasTitme?: boolean) => {
  const { State, Propm_CurPrice, Propm_StartPrice, MyPrice, Propm_EndTime } =
    record || {};

  const endDate = moment(Propm_EndTime).format("YYYY-MM-DD HH:mm:ss");
  const text =
    State === BidType.IN_PREPARATION || State === BidType.PROCESSING
      ? "预计"
      : "";

  return (
    <div className="price-cell">
      <Statistic title="起拍价" value={Propm_StartPrice} prefix="¥" />
      {State === BidType.PROCESSING && (
        <Statistic
          className="red"
          title="当前价"
          value={Propm_CurPrice === 0 ? "**" : Propm_CurPrice}
          prefix={Propm_CurPrice === 0 ? "" : "¥"}
        />
      )}
      {State !== BidType.IN_PREPARATION && (
        <Statistic title="我司出价" value={MyPrice} prefix="¥" />
      )}
      {hasTitme && <Statistic title={`${text}结束时间`} value={endDate} />}
    </div>
  );
};

export const renderStatus = (record: any = {}) => {
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
};

export const renderEndTime = (record: any = {}) => {
  const { State, Propm_EndTime } = record || {};
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
};

export const columns: ColumnsType<any> = [
  {
    title: "名称",
    dataIndex: "Propm_Title",
    key: "Propm_Title",
    render: (_, record: any) => renderTitle(record),
  },
  {
    title: "价格",
    dataIndex: "Propm_CurPrice",
    key: "Propm_CurPrice",
    width: 200,
    render: (text, record: any) => renderPrice(record),
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    render: (_, record) => renderStatus(record),
  },
  {
    title: "时间",
    dataIndex: "Propm_EndTime",
    key: "Propm_EndTime",
    width: 200,
    render: (_, record: any) => renderEndTime(record),
  },
];
