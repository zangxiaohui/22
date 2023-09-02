import { MenuOutlined } from "@ant-design/icons";
import type { AvatarProps } from "antd";
import { ConfigProvider } from "antd";
import classNames from "classnames";
import React, { useContext } from "react";
import type { WithFalse } from "../../utils/typings";
import { clearMenuItem } from "../../utils/utils";
// import { AppsLogoComponents, defaultRenderLogo } from "../AppsLogoComponents";
import { defaultRenderLogo } from "../AppsLogoComponents";
import type { HeaderViewProps } from "../Header";
import type { SiderMenuProps } from "../SiderMenu/SiderMenu";
import { renderLogoAndTitle } from "../SiderMenu/SiderMenu";
import { TopNavHeader } from "../TopNavHeader";
import { ActionsContent } from "./ActionsContent";
import "./index.less";

export type GlobalHeaderProps = {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  isMobile?: boolean;
  logo?: React.ReactNode;
  /**
   * @name 虽然叫menuRender，但是其实是整个 SiderMenu 面板的渲染函数
   *
   * @example 收起时完成不展示菜单 menuRender={(props,defaultDom)=> props.collapsed ? null : defaultDom}
   * @example 不展示菜单 menuRender={false}
   */
  menuRender?: WithFalse<
    (props: HeaderViewProps, defaultDom: React.ReactNode) => React.ReactNode
  >;
  /**
   * @deprecated
   * 使用 actionsRender 和 avatarProps 代替
   */
  rightContentRender?: WithFalse<(props: HeaderViewProps) => React.ReactNode>;
  className?: string;
  prefixCls?: string;
  /** 相关品牌的列表 */
  appList?: any;
  /** 相关品牌的列表项 点击事件，当事件存在时，appList 内配置的 url 不在自动跳转 */
  itemClick?: (
    item: any,
    popoverRef?: React.RefObject<HTMLSpanElement>
  ) => void;
  menuData?: any[];
  onMenuHeaderClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  style?: React.CSSProperties;
  menuHeaderRender?: SiderMenuProps["menuHeaderRender"];

  /**
   * @name 顶部区域的渲染，包含内部的 menu
   *
   * @example headerContentRender={(props) => <div>管理控制台 </div>}
   */
  headerContentRender?: WithFalse<
    (props: HeaderViewProps, defaultDom: React.ReactNode) => React.ReactNode
  >;
  collapsedButtonRender?: SiderMenuProps["collapsedButtonRender"];

  splitMenus?: boolean;
  /** Layout的操作功能列表，不同的 layout 会放到不同的位置 */
  actionsRender?: WithFalse<(props: HeaderViewProps) => React.ReactNode[]>;

  /** 头像的设置 */
  avatarProps?: WithFalse<
    AvatarProps & {
      title?: React.ReactNode;
      render?: (
        props: AvatarProps,
        defaultDom: React.ReactNode
      ) => React.ReactNode;
    }
  >;
  children?: React.ReactNode;
};

const renderLogo = (
  menuHeaderRender: SiderMenuProps["menuHeaderRender"],
  logoDom: React.ReactNode
) => {
  if (menuHeaderRender === false) {
    return null;
  }
  if (menuHeaderRender) {
    return menuHeaderRender(logoDom, null);
  }
  return logoDom;
};

const GlobalHeader: React.FC<any> = (props) => {
  const {
    isMobile,
    logo,
    collapsed,
    onCollapse,
    menuHeaderRender,
    onMenuHeaderClick,
    className: propClassName,
    style,
    layout,
    children,
    splitMenus,
    menuData,
    prefixCls,
  } = props;

  const { getPrefixCls, direction } = useContext(ConfigProvider.ConfigContext);
  const baseClassName = `${prefixCls || getPrefixCls("pro")}-global-header`;
  const className = classNames(propClassName, baseClassName, "zzzz");

  if (layout === "mix" && !isMobile && splitMenus) {
    const noChildrenMenuData = (menuData || []).map((item: any) => ({
      ...item,
      children: undefined,
      routes: undefined,
    }));
    const clearMenuData = clearMenuItem(noChildrenMenuData);
    return (
      <TopNavHeader
        mode="horizontal"
        {...props}
        splitMenus={false}
        menuData={clearMenuData}
      />
    );
  }

  const logoClassNames = classNames(`${baseClassName}-logo`, {
    [`${baseClassName}-logo-rtl`]: direction === "rtl",
    [`${baseClassName}-logo-mix`]: layout === "mix",
    [`${baseClassName}-logo-mobile`]: isMobile,
  });

  const logoDom = (
    <span className={logoClassNames} key="logo">
      <a>{defaultRenderLogo(logo)}</a>
    </span>
  );

  return (
    <div className={className} style={{ ...style }}>
      {isMobile && (
        <span
          className={`${baseClassName}-collapsed-button`}
          onClick={() => {
            onCollapse?.(!collapsed);
          }}
        >
          <MenuOutlined />
        </span>
      )}
      {isMobile && renderLogo(menuHeaderRender, logoDom)}
      {layout === "mix" && !isMobile && (
        <>
          {/* <AppsLogoComponents {...props} /> */}
          <div className={logoClassNames} onClick={onMenuHeaderClick}>
            {renderLogoAndTitle(
              { ...props, collapsed: false },
              "headerTitleRender"
            )}
          </div>
        </>
      )}
      {/* <div style={{ flex: 1 }}>{children}</div> */}
      <div style={{ flex: 1 }}>{children}</div>
      <ActionsContent {...props} />
    </div>
  );
};

export { GlobalHeader };
