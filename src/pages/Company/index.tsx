import { Tabs } from "antd";
import React, { useState } from "react";
import PageContainer from "../../components/PageContainer";
import "./index.less";

export enum CompanyManageType {
  COMPANY_INFO = 0,
  OTHER_CERTIFICATION = 1,
  OTHER_CONTACT = 2,
}

const items: any[] = [
  { label: "企业信息管理", key: CompanyManageType.COMPANY_INFO },
  { label: "其他资质管理", key: CompanyManageType.OTHER_CERTIFICATION },
  { label: "其他联系人审核", key: CompanyManageType.OTHER_CONTACT },
];

const Company: React.FC = () => {
  const [tabActiveKey, setTabActiveKey] = useState<CompanyManageType>(
    CompanyManageType.COMPANY_INFO
  );

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
      <Tabs
        activeKey={tabActiveKey as any}
        onChange={onTabChange}
        type="card"
        items={items}
        // tabBarExtraContent={
        //   <div className="h">有疑问请立即咨询 4008-888-8888</div>
        // }
      />
    </PageContainer>
  );
};

export default Company;
