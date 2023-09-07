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
    <PageContainer routes={routes} loading={loading}>
      <div>{data?.Title}</div>

      <div
        className="content"
        style={{ minHeight: 400 }}
        dangerouslySetInnerHTML={{ __html: data?.Con }}
      ></div>
    </PageContainer>
  );
};

export default Product;
