import { Button, Card, List } from "antd";
import React from "react";
import PageContainer from "../../components/PageContainer";
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
      breadcrumbName: "全部产品",
    },
  ];

  return (
    <PageContainer routes={routes} className="bid">
      <List
        grid={{ gutter: 18, column: 2 }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Card title={item.title} className="bid-card">
              <div>
                <div> 当前价8888.88万</div>
                <div> 起拍价8888.88万</div>
                <div> 当前价8888.88万</div>
                <div> 当前价8888.88万</div>
              </div>
              <div className="bid-action">
                <Button type="primary" block>
                  正在进行中
                </Button>
                <Button type="primary" block>
                  参加人数
                </Button>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </PageContainer>
  );
};

export default Home;