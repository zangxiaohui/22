import React, { useEffect, useState } from "react";
import PageContainer from "../../components/PageContainer";
import { getContactInfo } from "../../services/api";
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
    getContactInfo().then((res) => {
      if (res.state) {
        setData(res.data);
      }
      setLoading(false);
    });
  }, []);

  return (
    <PageContainer routes={routes} loading={loading}>
      <div
        className="content"
        style={{ minHeight: 400 }}
        dangerouslySetInnerHTML={{ __html: data?.Con }}
      ></div>
    </PageContainer>
  );
};

export default Contact;
