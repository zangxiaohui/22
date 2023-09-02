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
  const baseClassName = `${prefixCls}-layout-header`;

  const className = classNames(propsClassName, baseClassName, {
    [`${baseClassName}-fixed-header`]: needFixedHeader,
    [`${baseClassName}-mix`]: layout === "mix",
    [`${baseClassName}-fixed-header-action`]: !collapsed,
    [`${baseClassName}-top-menu`]: isTop,
    [`${baseClassName}-header`]: true,
  });

  if (layout === "side" && !isMobile) return null;
  return (
    <>
      <Header className={className} style={style}>
        {renderContent()}
      </Header>
    </>
  );
};

export { DefaultHeader };
