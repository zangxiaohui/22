import { Button, Card, List } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../../components/PageContainer";
import { getBidList } from "../../services/bid";
import "./index.less";

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
      page: 1,
    }).then((res) => {
      setLoading(false);
      setData(res?.data);
    });
  }, []);

  return (
    <PageContainer routes={routes} className="bid">
      <List
        loading={loading}
        grid={{ gutter: 18, column: 2 }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Link to={`/client/bid/detail/${item?.Propm_Id}`}>
              <Card title={item?.Propm_Title} className="bid-card">
                <div>
                  <div className="item">
                    <span className="label">当前价</span>
                    <span className="desc h">
                      ¥
                      <span className="price">
                        {item?.Propm_CurPrice ?? "--"}
                      </span>
                    </span>
                  </div>
                  <div className="item">
                    <span className="label">起拍价</span>
                    <span className="desc">
                      ¥{item?.Propm_StartPrice ?? "--"}
                    </span>
                  </div>
                  <div className="item">
                    <span className="label">预&nbsp;&nbsp;&nbsp;&nbsp;计</span>
                    <span className="desc">{item?.Propm_Remark ?? "--"}</span>
                  </div>
                  <div className="item">
                    <span className="label">备&nbsp;&nbsp;&nbsp;&nbsp;注</span>
                    <span className="desc">{item?.Propm_Remark ?? "--"}</span>
                  </div>
                </div>
                <div className="bid-action">
                  <Button type="primary" block>
                    {item?.StateName ?? "--"}
                  </Button>
                  <Button type="primary" block>
                    参加人数 {item?.Cyrs ?? 0}
                  </Button>
                </div>
              </Card>
            </Link>
          </List.Item>
        )}
      />
    </PageContainer>
  );
};

export default BidList;
