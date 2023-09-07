import { useRequest } from "ahooks";
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
import React, { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import PageContainer from "../../../components/PageContainer";
import { useCurrentCompany, useSelf } from "../../../layouts/RouteContext";
import {
  BidType,
  BidTypeColor,
  getBidDetail,
  getCurrentBidPrice,
  postBid,
} from "../../../services/bid";
import Row from "../components/DescriptionRow";
import HistoryModal from "../components/HistoryModal";
import BidConfirmModal from "./BidConfirmModal";
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

const items = [{ label: "拍品详情", key: "item-1" }];

const BidDetail: React.FC = () => {
  const currentUser = useSelf();
  const currentCompany = useCurrentCompany();

  const { id } = useParams<{ id: string }>();
  const [x, forceUpdate] = useReducer((x) => x + 1, 1);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [bidPrice, setBidPrice] = useState<number>();
  const [currentPrice, setCurrentPrice] = useState<number>();
  const [historyVisible, setHistoryVisible] = useState<boolean>(false);
  const [bidConfirmModalVisible, setBidConfirmModalVisible] =
    useState<boolean>(false);

  const isProcessing = data?.State === BidType.PROCESSING;

  const deadline = moment(data?.Propm_EndTime);

  useEffect(() => {
    setLoading(true);
    getBidDetail({
      Id: Number(id),
    }).then((res) => {
      setLoading(false);
      setData(res?.data);
      const { Propm_CurPrice, Propm_StartPrice, MyPrice } = res?.data || {};
      setBidPrice(Propm_CurPrice || Propm_StartPrice);
    });
  }, [id, x]);

  const { data: pollingBidPriceData, run } = useRequest(
    () =>
      getCurrentBidPrice({
        Id: Number(id),
      }),
    {
      pollingInterval: 1000 * 10,
      ready: !!id && isProcessing,
    }
  );

  useEffect(() => {
    if (pollingBidPriceData?.data > 0) {
      setCurrentPrice(pollingBidPriceData?.data);
    }
  }, [pollingBidPriceData?.data]);

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
    if (!isNil(bidPrice)) {
      postBid({
        Id: Number(id),
        price: bidPrice,
      }).then((res) => {
        if (res.state) {
          message.success("出价成功");
          run();
          forceUpdate();
          setBidConfirmModalVisible(false);
        } else {
          Modal.error({
            title: res?.msg,
            okText: "关闭",
            width: 440,
          });
        }
      });
    }
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

          {/* <Statistic
            title={data?.State === BidType.FINISHED ? "成交价" : "当前价"}
            value={currentPrice}
            prefix="¥"
            className="meta-price"
          /> */}

          {(data?.State === BidType.PROCESSING ||
            data?.State === BidType.FINISHED ||
            data?.State === BidType.TERMINATED) && (
            <Row
              status={data?.State}
              label={data?.State === BidType.FINISHED ? "成交价" : "当前价"}
              prefix="¥"
              desc={currentPrice || bidPrice}
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
                  onClick={() => setBidConfirmModalVisible(true)}
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
        type="card"
        items={items}
        tabBarExtraContent={<div className="h">{currentUser?.serviceTel}</div>}
      />
      <div
        style={{ padding: "10px 30px 30px" }}
        dangerouslySetInnerHTML={{ __html: data?.Propm_Content }}
      ></div>

      <HistoryModal
        visible={historyVisible}
        onCancel={() => setHistoryVisible(false)}
        companyName={currentCompany?.Name}
      />

      <BidConfirmModal
        visible={bidConfirmModalVisible}
        onCancel={() => setBidConfirmModalVisible(false)}
      >
        <div className="mod">
          <div className="mod-hd">
            <div>{currentUser?.Name}，您好！</div>
            <div>您将代表{currentCompany?.Name}提交的竞价为：</div>
          </div>
          <div className="mod-bd">
            <div>产品名 {data?.Propm_Title}</div>
            <Statistic title="出　价" value={bidPrice} prefix="¥" />
            <div></div>
          </div>
          <div className="mod-ft">
            <Button
              type="primary"
              size="large"
              className="btn-red btn1"
              onClick={handleBid}
            >
              确认出价
            </Button>
            <Button
              size="large"
              className="btn2"
              onClick={() => setBidConfirmModalVisible(false)}
            >
              先不出价
            </Button>
          </div>
        </div>
      </BidConfirmModal>
    </PageContainer>
  );
};

export default BidDetail;
