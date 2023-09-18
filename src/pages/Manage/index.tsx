import { Tabs } from "antd";
import React, { useState } from "react";
import PageContainer from "../../components/PageContainer";
import { getUserInfo } from "../../utils/utils";
import OtherCertification from "./Certification";
import CompanyInfo from "./CompanyInfo";
import OtherContact from "./Contact";
import "./index.less";

export enum CompanyManageType {
  COMPANY_INFO = 0,
  OTHER_CERTIFICATION = 1,
  OTHER_CONTACT = 2,
}

const Company: React.FC = () => {
  const { isMain, companyStatus } = getUserInfo();
  const [tabActiveKey, setTabActiveKey] = useState<CompanyManageType>(
    CompanyManageType.COMPANY_INFO
  );

  const items: any[] = [
    {
      label: "企业信息管理",
      key: CompanyManageType.COMPANY_INFO,
      children: <CompanyInfo />,
    },
    {
      label: "其他资质管理",
      key: CompanyManageType.OTHER_CERTIFICATION,
      children: <OtherCertification />,
    },
  ];
  if (isMain) {
    items.push({
      label: "其他联系人审核",
      key: CompanyManageType.OTHER_CONTACT,
      children: <OtherContact />,
    });
  }

  const onTabChange = (key: string) => {
    setTabActiveKey(key as any);
    // history.push({
    //   query: {
    //     ...query,
    //     filter: key,
    //   },
    // });
  };

  const routes = [
    {
      breadcrumbName: "首页",
    },
    {
      breadcrumbName: "我的",
    },
    {
      breadcrumbName: items.find((item) => item.key === tabActiveKey)?.label,
    },
  ];

  return (
    <PageContainer routes={routes} className="company">
      <div style={{ width: "100%" }}>
        <Tabs
          activeKey={tabActiveKey as any}
          onChange={onTabChange}
          type="card"
          items={items}
          tabPosition="top"
          // tabBarExtraContent={
          //   <div className="h">有疑问请立即咨询 4008-888-8888</div>
          // }
        />
      </div>
    </PageContainer>
  );
};

export default Company;
