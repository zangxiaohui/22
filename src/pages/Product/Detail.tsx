import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageContainer from "../../components/PageContainer";
import { getProductDetail } from "../../services/api";
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
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>();

  useEffect(() => {
    setLoading(true);
    getProductDetail({
      Id: id,
    })
      .then((res) => {
        if (res.state) {
          setData(res?.data);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <PageContainer
      routes={routes}
      loading={loading}
      className="product-detail-page"
    >
      <Row>
        {/* <Col flex="537px" style={{ paddingTop: 50, marginBottom: 30 }}>
          <div className="product-detail-col-left">
            <img alt="" src={data?.Image} className="product-img" />
            <div className="pro-desc">
              <div className="small-img">
                <img alt="" src={data?.SubImage} className="small-img" />
              </div>
              <div className="sub-title">{data?.SubTitle}</div>
            </div>
          </div>
        </Col> */}
        <Col flex="auto">
          <div
            className="product-detail-col-right"
            style={{ paddingBottom: 20 }}
          >
            <div className="sub-title">{data?.CateName || "类别"}</div>
            <div className="title">{data?.Title}</div>
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: data?.Con }}
            ></div>
          </div>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Product;
