import {
  Button,
  Col,
  Descriptions,
  Form,
  InputNumber,
  Row,
  Statistic,
  Tabs,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageContainer from "../../../components/PageContainer";
import PageLoading from "../../../components/PageLoading";
import { getBidDetail } from "../../../services/bid";
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
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const { currentPrice, setCurrentPrice } = useState();

  const deadline = moment(data?.Propm_EndTime);

  useEffect(() => {
    setLoading(true);
    getBidDetail({
      Id: Number(id),
    }).then((res) => {
      setLoading(false);
      setData(res?.data);
    });
  }, [id]);

  console.log("data :>> 1223 ", data);

  const onChange = (key: string) => {
    console.log(key);
  };

  const items = [{ label: "拍品详情", key: "item-1" }];

  const onChange2 = (value: any) => {
    console.log("changed", value);
  };

  const step = data?.Propm_StepPrice;

  if (!data) {
    return <PageLoading />;
  }

  return (
    <PageContainer routes={routes}>
      <div className="bid-row1">
        <h1>{data?.Propm_Title}</h1>
        <div className="statistic-wrap">
          <Countdown
            title="距结束"
            value={deadline as any}
            format="D 天 H 时 m 分 s 秒"
          />
          <Statistic title="当前价" value={data?.Propm_CurPrice} prefix="￥" />
        </div>
      </div>
      <Row className="bid-row2">
        <Col flex="540px">
          <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
            <Form.Item label="出&nbsp;&nbsp;价">
              <InputNumber
                min={1}
                defaultValue={9992929}
                onChange={onChange2}
                size="large"
                formatter={(value) =>
                  `￥${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
              />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
              <Button type="primary" size="large" block>
                出价
              </Button>
            </Form.Item>
          </Form>
        </Col>

        <Col flex="auto">
          <Descriptions column={2}>
            <Descriptions.Item label="我司出价">
              ￥{data?.MyPrice}
            </Descriptions.Item>
            <Descriptions.Item label="加价幅度">
              ￥{data?.Propm_StepPrice}
            </Descriptions.Item>
            <Descriptions.Item label="起拍价">
              ￥{data?.Propm_StartPrice}
            </Descriptions.Item>
            <Descriptions.Item label="顺延周期">
              {data?.Propm_AddType}
            </Descriptions.Item>
          </Descriptions>
          <Button type="link">我司历史出价记录</Button>
        </Col>
      </Row>
      <Tabs
        onChange={onChange}
        type="card"
        items={items}
        tabBarExtraContent={
          <div className="h">有疑问请立即咨询 4008-888-8888</div>
        }
      />
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: data.content }}
      ></div>
    </PageContainer>
  );
};

export default BidDetail;
