import type { SpinProps, TabPaneProps, TabsProps } from "antd";
import { PageHeader } from "antd";
import classNames from "classnames";
import React, { useMemo } from "react";
import GridContent from "../GridContent";
import PageLoading from "../PageLoading";
import "./index.less";

export interface PageHeaderTabConfig {
  tabList?: (TabPaneProps & { key?: React.ReactText })[];
  tabActiveKey?: TabsProps["activeKey"];
  onTabChange?: TabsProps["onChange"];
  tabBarExtraContent?: TabsProps["tabBarExtraContent"];
  tabProps?: TabsProps;
}

function genLoading(spinProps: boolean | SpinProps) {
  if (typeof spinProps === "object") {
    return spinProps;
  }
  return { spinning: spinProps };
}

export interface PageContainerProps {}

const PageContainer: React.FC<any> = (props) => {
  const {
    children,
    loading,
    pageHeaderTitle,
    routes,
    prefixCls = "ant-pro",
  } = props;

  const prefixedClassName = `${prefixCls}-page-container`;

  const className = classNames(prefixedClassName, props.className);

  const basePageContainer = "ant-pro-page-container";

  const loadingDom = useMemo(() => {
    // 当loading时一个合法的ReactNode时，说明用户使用了自定义loading,直接返回改自定义loading
    if (React.isValidElement(loading)) {
      return loading;
    }
    // 当传递过来的是布尔值，并且为false时，说明不需要显示loading,返回null
    if (typeof loading === "boolean" && !loading) {
      return null;
    }
    // 如非上述两种情况，那么要么用户传了一个true,要么用户传了loading配置，使用genLoading生成loading配置后返回PageLoading
    const spinProps = genLoading(loading as boolean | SpinProps);
    // 如果传的是loading配置，但spinning传的是false，也不需要显示loading
    return spinProps.spinning ? <PageLoading {...spinProps} /> : null;
  }, [loading]);

  const content = useMemo(() => {
    return children ? (
      <>
        <div className={classNames(`${basePageContainer}-children-container`)}>
          {children}
        </div>
      </>
    ) : null;
  }, [children, basePageContainer]);

  const renderContentDom = useMemo(() => {
    // 只要loadingDom非空我们就渲染loadingDom,否则渲染内容
    const dom = loadingDom || content;

    return dom;
  }, [loadingDom, content]);

  return (
    <div className={className}>
      <div className={`${prefixedClassName}-header`}>
        <PageHeader title={pageHeaderTitle} breadcrumb={{ routes }} />
      </div>
      {renderContentDom && <GridContent>{renderContentDom}</GridContent>}
      {/* <GridContent>
        {children ? (
          <div>
            <div className={`${prefixedClassName}-children-content`}>
              {children}
            </div>
          </div>
        ) : null}
      </GridContent> */}
    </div>
  );
};

export default PageContainer;
