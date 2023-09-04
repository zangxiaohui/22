import React from "react";
import PageContainer from "../../components/PageContainer";
import "./index.less";

const Home: React.FC = () => {
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

  return (
    <PageContainer routes={routes}>
      <div>
        这个区域可以通过后台录入图片，文字，表格等内容
        内容过多时，可以滚动向下翻页
      </div>
    </PageContainer>
  );
};

export default Home;
