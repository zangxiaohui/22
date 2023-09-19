import { Card, List } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import PageContainer from "../../components/PageContainer";
import { Paging, usePaging } from "../../components/Paging";
import { getProductList } from "../../services/api";
import "./index.less";

const routes = [
  {
    breadcrumbName: "首页",
  },
  {
    breadcrumbName: "新品推荐",
  },
];

const Product: React.FC = () => {
  const { cateId } = useParams<{ cateId: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>();

  const pagingInfo = usePaging();
  const { pageOffset, pageSize, setTotalCount } = pagingInfo;

  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    getProductList({
      pagesize: pageSize,
      page: pageOffset,
      cateid: cateId,
    })
      .then((res) => {
        if (res.state) {
          setData(res?.data);
          setTotalCount(res?.total);
        }
      })
      .finally(() => setLoading(false));
  }, [cateId, pageSize, pageOffset, setTotalCount]);

  return (
    <PageContainer routes={routes} loading={loading} className="product-page">
      <div>
        <List
          className="product-list"
          grid={{
            gutter: 20,
            xs: 1,
          }}
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <Card
                onClick={() =>
                  history.push(`/client/product/detail/${item.Id}`)
                }
                hoverable
                cover={<img alt="" src={item.Image} />}
              >
                <Card.Meta title={item.CateName} description={item.Title} />
              </Card>
            </List.Item>
          )}
        />
        <Paging pagingInfo={pagingInfo} />
      </div>
    </PageContainer>
  );
};

export default Product;
