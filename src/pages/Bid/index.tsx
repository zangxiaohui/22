import { Button, Card, List } from "antd";
import React, { useEffect, useState } from "react";
import PageContainer from "../../components/PageContainer";
import { getBidList } from "../../services/bid";
import "./index.less";

const data = [
  {
    title: "这里显示产品名称，这里显示产品名称，100吨",
  },
  {
    title: "这里显示产品名称，这里显示产品名称，100吨",
  },
];

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

const BidList: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>();

  useEffect(() => {
    setLoading(true);
    getBidList({
      state: 0,
      pagesize: 10,
      page: 0,
    }).then((res) => {
      setLoading(false);
      setData(res?.data);
      console.log("res bidList :>> ", res);
    });
  }, []);

  console.log("da :>> ", data);

  return (
    <PageContainer routes={routes} className="bid">
      <List
        loading={loading}
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

export default BidList;
