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
      <div>
        张三您好，您是 无锡猎豹信息科技有限公司 首位注册人
        在完善企业信息后，您将成为企业管理员。所有通过该企业名称注册的会员需由您审核后才能正常使用
      </div>
    </PageContainer>
  );
};

export default Company;
