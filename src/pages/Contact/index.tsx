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
    path: "/client/contact",
    breadcrumbName: "联系我们",
  },
];

const Contact: React.FC = () => {
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

  return (
    <PageContainer routes={routes} loading={loading}>
      <div>联系我们</div>
    </PageContainer>
  );
};

export default Contact;
