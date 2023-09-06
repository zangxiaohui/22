import {
  Row as AntRow,
  Button,
  Col,
  Descriptions,
  Form,
  InputNumber,
  Modal,
  Statistic,
  Tabs,
  message,
} from "antd";
import { isNil } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageContainer from "../../../components/PageContainer";
import { useSelf } from "../../../layouts/RouteContext";
import {
  BidType,
  BidTypeColor,
  getBidDetail,
  getCurrentBidPrice,
  postBid,
} from "../../../services/bid";
import Row from "../components/DescriptionRow";
import HistoryModal from "../components/HistoryModal";
import "./index.less";

const { Countdown } = Statistic;

const routes = [
  {
    breadcrumbName: "首页",
  },
  {
    breadcrumbName: "招标的产品",
  },
  {
    breadcrumbName: "拍品详情",
  },
];

const BidDetail: React.FC = () => {
  const currentUser = useSelf();
  const [historyVisible, setHistoryVisible] = useState<boolean>(false);

  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [bidPrice, setBidPrice] = useState<number>();
  const [currentPrice, setCurrentPrice] = useState<number>();

  const deadline = moment(data?.Propm_EndTime);

  useEffect(() => {
    setLoading(true);
    getBidDetail({
      Id: Number(id),
    }).then((res) => {
      setLoading(false);
      setData(res?.data);
      console.log("res?.data?.Propm_CurPrice :>> ", res?.data?.Propm_CurPrice);
      setBidPrice(res?.data?.Propm_CurPrice);
    });
  }, [id]);

  useEffect(() => {
    getCurrentBidPrice({
      Id: Number(id),
    }).then((res) => {
      setCurrentPrice(res?.data);
    });
  }, [id]);

  const onChange = (key: string) => {
    console.log(key);
  };

  const items = [{ label: "拍品详情", key: "item-1" }];

  const onChangeBidPrice = (value: number | null) => {
    if (!isNil(value)) {
      setBidPrice(value);
    }
  };

  // 出价记录
  const viewHistory = () => {
    setHistoryVisible(true);
  };

  const handleBid = () => {
    Modal.confirm({
      title: `张三，您好！`,
      content: "...to do",
      okText: "确认出价",
      cancelText: "先不出价",
      onOk() {
        if (!isNil(bidPrice)) {
          postBid({
            Id: Number(id),
            price: bidPrice,
          }).then((res) => {
            if (res.state) {
              message.success("出价成功");
            }
            console.log(res);
          });
        }
      },
    });
  };

  return (
    <PageContainer routes={routes} loading={loading || !data}>
      <div className="bid-row1">
        <h1>{data?.Propm_Title}</h1>
        <div className="statistic-wrap">
          <Countdown
            title="距结束"
            value={deadline as any}
            format="D 天 H 时 m 分 s 秒"
          />

          {(data?.State === BidType.PROCESSING ||
            data?.State === BidType.FINISHED ||
            data?.State === BidType.TERMINATED) && (
            <Row
              status={data?.State}
              label={data?.State === BidType.FINISHED ? "成交价" : "当前价"}
              prefix="¥"
              desc={currentPrice}
              className="font-size-lg colorful"
            />
          )}
          {data?.State === BidType.IN_PREPARATION && (
            <Row
              status={data?.State}
              label="起拍价"
              prefix="¥"
              desc={data?.Propm_StartPrice}
              className="font-size-lg colorful"
            />
          )}
        </div>
        <div className="bid-action">
          <Button
            type="primary"
            block
            className={`btn-${BidTypeColor[data?.State as BidType]}`}
          >
            {data?.StateName ?? "--"}
          </Button>
          <Button type="primary" block>
            参加人数 {data?.Cyrs ?? 0}
          </Button>
        </div>
      </div>
      <AntRow className="bid-row2">
        {data?.State === BidType.PROCESSING && (
          <Col flex="540px">
            <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              <Form.Item label="出&nbsp;&nbsp;价">
                <InputNumber
                  min={0}
                  value={bidPrice ?? 0}
                  onChange={onChangeBidPrice}
                  size="large"
                  formatter={(value) =>
                    `￥${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
                  step={data?.Propm_StepPrice ?? 1}
                />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
                <Button
                  type="primary"
                  size="large"
                  className="btn-red bidding-btn"
                  onClick={handleBid}
                >
                  出价
                </Button>
              </Form.Item>
            </Form>
          </Col>
        )}

        <Col flex="auto">
          <Descriptions column={2} className="details-area">
            <Descriptions.Item label="我司出价">
              ￥{data?.MyPrice}
            </Descriptions.Item>
            <Descriptions.Item label="加价幅度">
              ￥{data?.Propm_StepPrice}
            </Descriptions.Item>
            <Descriptions.Item label="起拍价">
              ￥{data?.Propm_StartPrice}
            </Descriptions.Item>
          </Descriptions>
          <Button type="link" onClick={viewHistory}>
            我司历史出价记录
          </Button>
        </Col>
      </AntRow>
      <Tabs
        onChange={onChange}
        type="card"
        items={items}
        tabBarExtraContent={<div className="h">{currentUser?.serviceTel}</div>}
      />
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: data?.content }}
      ></div>

      <HistoryModal
        visible={historyVisible}
        onCancel={() => setHistoryVisible(false)}
      />
    </PageContainer>
  );
};

export default BidDetail;
