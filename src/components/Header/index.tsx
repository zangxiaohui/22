import { Layout } from "antd";
import classNames from "classnames";
import React, { useCallback } from "react";
import type { WithFalse } from "../../utils/typings";
import { clearMenuItem } from "../../utils/utils";
import type { GlobalHeaderProps } from "../GlobalHeader";
import { GlobalHeader } from "../GlobalHeader";
import { TopNavHeader } from "../TopNavHeader";
import "./index.less";

const { Header } = Layout;

export type HeaderViewProps = GlobalHeaderProps & {
  isMobile?: boolean;
  logo?: React.ReactNode;
  headerRender?: WithFalse<
    (props: HeaderViewProps, defaultDom: React.ReactNode) => React.ReactNode
  >;
  headerTitleRender?: WithFalse<
    (
      logo: React.ReactNode,
      title: React.ReactNode,
      props: HeaderViewProps
    ) => React.ReactNode
  >;
  headerContentRender?: WithFalse<
    (props: HeaderViewProps, defaultDom: React.ReactNode) => React.ReactNode
  >;
  siderWidth?: number;
  hasSiderMenu?: boolean;
};

const DefaultHeader: React.FC<any> = (props) => {
  const {
    isMobile,
    fixedHeader,
    className: propsClassName,
    style,
    collapsed,
    prefixCls,
    onCollapse,
    layout,
    headerRender,
    headerContentRender,
    headerHeight,
  } = props;

  const needFixedHeader = fixedHeader || layout === "mix";

  const renderContent = useCallback(() => {
    const isTop = layout === "top";
    const clearMenuData = clearMenuItem(props.menuData || []);

    let defaultDom = (
      <GlobalHeader onCollapse={onCollapse} {...props} menuData={clearMenuData}>
        {headerContentRender && headerContentRender(props, null)}
      </GlobalHeader>
    );
    if (isTop && !isMobile) {
      defaultDom = (
        <TopNavHeader
          mode="horizontal"
          onCollapse={onCollapse}
          {...props}
          menuData={clearMenuData}
        />
      );
    }
    if (headerRender && typeof headerRender === "function") {
      return headerRender(props, defaultDom);
    }
    return defaultDom;
  }, [headerContentRender, headerRender, isMobile, layout, onCollapse, props]);

  const isTop = layout === "top";

  const className = classNames(propsClassName, {
    [`${prefixCls}-fixed-header`]: needFixedHeader,
    [`${prefixCls}-fixed-header-action`]: !collapsed,
    [`${prefixCls}-top-menu`]: isTop,
  });

  const right = needFixedHeader ? 0 : undefined;

  if (layout === "side" && !isMobile) return null;

  return (
    <>
      {needFixedHeader && (
        <Header
          style={{
            height: headerHeight,
            lineHeight: `${headerHeight}px`,
            backgroundColor: "transparent",
            zIndex: 19,
            ...style,
          }}
        />
      )}
      <Header
        className={className}
        style={{
          height: headerHeight,
          lineHeight: `${headerHeight}px`,
          zIndex: layout === "mix" ? 100 : 19,
          right,
          ...style,
        }}
      >
        {renderContent()}
      </Header>
    </>
  );
};

export default DefaultHeader;
