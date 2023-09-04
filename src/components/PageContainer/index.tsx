import { PageHeader } from "antd";
import { TabPaneProps, TabsProps } from "antd/es/tabs";
import classNames from "classnames";
import React from "react";
import GridContent from "../GridContent";
import "./index.less";

export interface PageHeaderTabConfig {
  tabList?: (TabPaneProps & { key?: React.ReactText })[];
  tabActiveKey?: TabsProps["activeKey"];
  onTabChange?: TabsProps["onChange"];
  tabBarExtraContent?: TabsProps["tabBarExtraContent"];
  tabProps?: TabsProps;
}

export interface PageContainerProps {}

const PageContainer: React.FC<any> = (props) => {
  const { children, pageHeaderTitle, routes, prefixCls = "ant-pro" } = props;

  const prefixedClassName = `${prefixCls}-page-container`;

  const className = classNames(prefixedClassName, props.className);

  return (
    <div className={className}>
      <div className={`${prefixedClassName}-header`}>
        <PageHeader title={pageHeaderTitle} breadcrumb={{ routes }} />
      </div>
      <GridContent>
        {children ? (
          <div>
            <div className={`${prefixedClassName}-children-content`}>
              {children}
            </div>
          </div>
        ) : null}
      </GridContent>
    </div>
  );
};

export default PageContainer;
