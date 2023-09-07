import React, { useEffect, useState } from "react";
import PageContainer from "../../components/PageContainer";
import { getNoticeInfo } from "../../services/api";
import "./index.less";

const routes = [
  {
    path: "/client",
    breadcrumbName: "首页",
  },
  {
    path: "first",
    breadcrumbName: "1111",
  },
];

const Home: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    setLoading(true);
    getNoticeInfo().then((res) => {
      if (res.state) {
        setData(res.data);
      }
      setLoading(false);
    });
  }, []);

  return (
    <PageContainer routes={routes} loading={loading}>
      2222
    </PageContainer>
  );
};

export default Home;
