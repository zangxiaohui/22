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
    breadcrumbName: "招标须知",
  },
];

const Home: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [data, setData] = useState<any>({});

  useEffect(() => {
    setLoading(true);
    getNoticeInfo().then((res) => {
      if (res.state) {
        setData(res.state);
      }
      setLoading(false);
    });
  }, []);

  console.log("data  home home :>> ", data);

  console.log("loading :>> ", loading);

  return (
    <PageContainer routes={routes} loading={loading}>
      <div>
        这个区域可以通过后台录入图片，文字，表格等内容
        内容过多时，可以滚动向下翻页
      </div>
    </PageContainer>
  );
};

export default Home;
