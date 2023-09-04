import { Button, Col, Form, InputNumber, Row, Tabs } from "antd";
import React from "react";
import PageContainer from "../../../components/PageContainer";
import "./index.less";

const data = [
  {
    title: "这里显示产品名称，这里显示产品名称，100吨",
  },
  {
    title: "这里显示产品名称，这里显示产品名称，100吨",
  },
];

const Home: React.FC = () => {
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

  const onChange = (key: string) => {
    console.log(key);
  };

  const items = [
    { label: "拍品详情", key: "item-1", children: "内容 1" },
    { label: "招标公告", key: "item-2", children: "内容 2" },
  ];

  const onChange2 = (value: any) => {
    console.log("changed", value);
  };

  return (
    <PageContainer routes={routes}>
      <Row className="bid-row2">
        <Col flex="540px">
          <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
            <Form.Item label="出&nbsp;&nbsp;价">
              <InputNumber
                min={1}
                defaultValue={3}
                onChange={onChange2}
                size="large"
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
    </PageContainer>
  );
};

export default Home;
