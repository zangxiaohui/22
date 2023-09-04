import { Button, Col, Form, InputNumber, Row, Statistic, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageContainer from "../../../components/PageContainer";
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
  const [data, setData] = useState<any>({
    content: "<div>123233</div>",
  });

  const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30; // Moment is also OK

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

  const items = [
    { label: "拍品详情", key: "item-1" },
    { label: "招标公告", key: "item-2" },
  ];

  const onChange2 = (value: any) => {
    console.log("changed", value);
  };

  return (
    <PageContainer routes={routes}>
      <div className="bid-row1">
        <h1>{data?.Propm_Title}</h1>
        <div className="statistic-wrap">
          <Countdown
            title="距结束"
            value={deadline}
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
