import type { AvatarProps } from "antd";
import { Avatar, Layout, Space } from "antd";
import { SiderContext } from "antd/es/layout/Sider";
import classNames from "classnames";
import type { CSSProperties } from "react";
import React, { useMemo } from "react";
import type { WithFalse } from "../../utils/typings";
import { defaultRenderLogo } from "../AppsLogoComponents";
import { CollapsedIcon } from "../CollapsedIcon";
import type { BaseMenuProps } from "./BaseMenu";
import { BaseMenu } from "./BaseMenu";
import "./index.less";

type AppItemProps = any;
type AppListProps = any;
type ItemType = any;
type HeaderViewProps = any;

const { Sider } = Layout;

export type HeaderRenderKey = "menuHeaderRender" | "headerTitleRender";

/**
 * 渲染 title 和 logo
 *
 * @param props
 * @param renderKey
 * @returns
 */
export const renderLogoAndTitle = (
  props: SiderMenuProps,
  renderKey: HeaderRenderKey = "menuHeaderRender"
): React.ReactNode => {
  const { logo, title, layout } = props;
  const renderFunction = props[renderKey || ""];
  if (renderFunction === false) {
    return null;
  }
  const logoDom = defaultRenderLogo(logo);
  // const titleDom = <h1>{title ?? "Ant Design Pro"}</h1>;
  const titleDom = (
    <div className="logo-title">
      <div className="cn-title">
        <span>百川·</span>招标系统
      </div>
      <div className="en-title">BAICHUAN INVITE TENDERS</div>
    </div>
  );

  if (renderFunction) {
    // when collapsed, no render title
    return renderFunction(logoDom, props.collapsed ? null : titleDom, props);
  }

  /**
   * 收起来时候直接不显示
   */
  if (props.isMobile) {
    return null;
  }
  if (layout === "mix" && renderKey === "menuHeaderRender") return false;
  if (props.collapsed) {
    return <a key="title">{logoDom}</a>;
  }
  return (
    <a key="title">
      {logoDom}
      {titleDom}
    </a>
  );
};

export type SiderMenuProps = {
  /** 品牌logo的标识 */
  logo?: React.ReactNode;
  /** 相关品牌的列表 */
  appList?: AppListProps;
  appListRender?: (
    props: AppListProps,
    defaultDom: React.ReactNode
  ) => React.ReactNode;
  /** 相关品牌的列表项 点击事件，当事件存在时，appList 内配置的 url 不在自动跳转 */
  itemClick?: (
    item: AppItemProps,
    popoverRef?: React.RefObject<HTMLSpanElement>
  ) => void;
  /** 菜单的宽度 */
  siderWidth?: number;
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

  /** Layout的操作功能列表，不同的 layout 会放到不同的位置 */
  actionsRender?: WithFalse<(props: HeaderViewProps) => React.ReactNode[]>;
  /**
   * @name  菜单 logo 和 title 区域的渲染
   *
   * @example 不要logo : menuHeaderRender={(logo,title)=> title}
   * @example 不要title : menuHeaderRender={(logo,title)=> logo}
   * @example 展开的时候显示title,收起显示 logo： menuHeaderRender={(logo,title,props)=> props.collapsed ? logo : title}
   * @example 不要这个区域了 : menuHeaderRender={false}
   */
  menuHeaderRender?: WithFalse<
    (
      logo: React.ReactNode,
      title: React.ReactNode,
      props?: SiderMenuProps
    ) => React.ReactNode
  >;
  /**
   * @name 侧边菜单底部的配置，可以增加一些底部操作
   *
   * @example 底部增加超链接 menuFooterRender={()=><a href="https://pro.ant.design">pro.ant.design</a>}
   * @example 根据收起展开配置不同的 dom  menuFooterRender={()=>collapsed? null :<a href="https://pro.ant.design">pro.ant.design</a>}
   */
  menuFooterRender?: WithFalse<(props?: SiderMenuProps) => React.ReactNode>;

  /**
   * @name 自定义展开收起按钮的渲染
   *
   * @example 使用文字渲染 collapsedButtonRender={(collapsed)=>collapsed?"展开":"收起"})}
   * @example 使用icon渲染 collapsedButtonRender={(collapsed)=>collapsed?<MenuUnfoldOutlined />:<MenuFoldOutlined />}
   * @example 不渲染按钮 collapsedButtonRender={false}
   */
  collapsedButtonRender?: WithFalse<
    (collapsed?: boolean, defaultDom?: React.ReactNode) => React.ReactNode
  >;
  /**
   * @name 菜单顶部logo 和 title 区域的点击事件
   *
   * @example 点击跳转到首页 onMenuHeaderClick={()=>{ history.push('/') }}
   */
  onMenuHeaderClick?: (e: React.MouseEvent<HTMLDivElement>) => void;

  onOpenChange?: (openKeys: WithFalse<string[]>) => void;
  getContainer?: false;

  /**
   * @name 侧边菜单的logo的样式，可以调整下大小
   *
   * @example 设置logo的大小为 42px logoStyle={{width: '42px', height: '42px'}}
   */
  logoStyle?: CSSProperties;
  hide?: boolean;
  className?: string;
  style?: CSSProperties;
} & Pick<BaseMenuProps, Exclude<keyof BaseMenuProps, ["onCollapse"]>>;

export type PrivateSiderMenuProps = {
  matchMenuKeys: string[];
  originCollapsed?: boolean;
  menuRenderType?: "header" | "sider";
};

const SiderMenu: React.FC<any> = (props) => {
  const {
    collapsed,
    originCollapsed,
    fixSiderbar,
    onCollapse,
    siderWidth,
    isMobile,
    onMenuHeaderClick,
    style,
    layout,
    collapsedButtonRender,
    prefixCls,
    avatarProps,

    //@ts-ignore
    rightContentRender,
    actionsRender,
    onOpenChange,
    logoStyle,
    headerHeight,
  } = props;

  const theme = "dark";

  const showSiderExtraDom = useMemo(() => {
    if (isMobile) return false;
    if (layout === "mix") return false;
    return true;
  }, [isMobile, layout]);

  const baseClassName = `${prefixCls}-sider`;

  // 收起的宽度
  const collapsedWidth = 64;

  const siderClassName = classNames(`${baseClassName}`, {
    [`${baseClassName}-fixed`]: fixSiderbar,
    [`${baseClassName}-fixed-mix`]:
      layout === "mix" && !isMobile && fixSiderbar,
    [`${baseClassName}-collapsed`]: props.collapsed,
    [`${baseClassName}-layout-${layout}`]: layout && !isMobile,
    [`${baseClassName}-light`]: theme !== "dark",
    [`${baseClassName}-mix`]: layout === "mix" && !isMobile,
  });

  const headerDom = renderLogoAndTitle(props);

  const menuRenderDom = useMemo(
    () => (
      <BaseMenu
        {...props}
        key="base-menu"
        mode={collapsed && !isMobile ? "vertical" : "inline"}
        handleOpenChange={onOpenChange}
        style={{
          width: "100%",
        }}
        className={`${baseClassName}-menu `}
      />
    ),
    [baseClassName, onOpenChange, props]
  );

  const avatarDom = useMemo(() => {
    if (!avatarProps) return null;
    const { title, render, ...rest } = avatarProps;
    const dom = (
      <div className={`${baseClassName}-actions-avatar`}>
        {rest?.src || rest?.srcSet || rest.icon || rest.children ? (
          <Avatar size={28} {...rest} />
        ) : null}
        {avatarProps.title && !collapsed && <span>{title}</span>}
      </div>
    );
    if (render) {
      return render(avatarProps, dom);
    }
    return dom;
  }, [avatarProps, baseClassName, collapsed]);

  const actionsDom = useMemo(
    () => {
      if (!actionsRender) return null;
      return (
        <Space
          align="center"
          size={4}
          direction={collapsed ? "vertical" : "horizontal"}
          className={classNames([
            `${baseClassName}-actions-list`,
            collapsed && `${baseClassName}-actions-list-collapsed`,
          ])}
        >
          {actionsRender?.(props).map((item: any, index: number) => {
            return (
              <div key={index} className={`${baseClassName}-actions-list-item`}>
                {item}
              </div>
            );
          })}
        </Space>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [actionsRender, baseClassName, collapsed]
  );

  const appsDom = useMemo(() => {
    return <div>app logo</div>;
  }, [props.appList, props.prefixCls]);

  const collapsedDom = useMemo(() => {
    if (collapsedButtonRender === false) return null;
    const dom = (
      <CollapsedIcon
        isMobile={isMobile}
        collapsed={originCollapsed}
        className={`${baseClassName}-collapsed-button`}
        onClick={() => {
          onCollapse?.(!originCollapsed);
        }}
      />
    );
    if (collapsedButtonRender) return collapsedButtonRender(collapsed, dom);
    return dom;
  }, [
    collapsedButtonRender,
    isMobile,
    originCollapsed,
    baseClassName,
    collapsed,
    onCollapse,
  ]);

  /** 操作区域的dom */
  const actionAreaDom = useMemo(() => {
    if (!avatarDom && !actionsDom) return null;

    return (
      <div
        className={classNames(
          `${baseClassName}-actions`,
          collapsed && `${baseClassName}-actions-collapsed`
        )}
      >
        {avatarDom}
        {actionsDom}
      </div>
    );
  }, [actionsDom, avatarDom, baseClassName, collapsed]);

  /* Using the useMemo hook to create a CSS class that will hide the menu when the menu is collapsed. */
  const hideMenuWhenCollapsedClassName = useMemo(() => {
    // 收起时完全隐藏菜单
    if (props?.menu?.hideMenuWhenCollapsed && collapsed) {
      return `${baseClassName}-hide-menu-collapsed`;
    }
    return null;
  }, [baseClassName, collapsed, props?.menu?.hideMenuWhenCollapsed]);

  const menuDomItems = (
    <>
      {headerDom && (
        <div
          className={classNames([
            classNames(`${baseClassName}-logo`, {
              [`${baseClassName}-logo-collapsed`]: collapsed,
            }),
          ])}
          onClick={showSiderExtraDom ? onMenuHeaderClick : undefined}
          id="logo"
          style={logoStyle}
        >
          {headerDom}
          {appsDom}
        </div>
      )}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {menuRenderDom}
      </div>
      <SiderContext.Provider value={{}}>
        {showSiderExtraDom && (
          <>
            {actionAreaDom}
            {!actionsDom && rightContentRender ? (
              <div
                className={classNames(`${baseClassName}-actions`, {
                  [`${baseClassName}-actions-collapsed`]: collapsed,
                })}
              >
                {rightContentRender?.(props)}
              </div>
            ) : null}
          </>
        )}
      </SiderContext.Provider>
    </>
  );

  return (
    <>
      {fixSiderbar && !isMobile && !hideMenuWhenCollapsedClassName && (
        <div
          style={{
            width: collapsed ? collapsedWidth : siderWidth,
            overflow: "hidden",
            flex: `0 0 ${collapsed ? collapsedWidth : siderWidth}px`,
            maxWidth: collapsed ? collapsedWidth : siderWidth,
            minWidth: collapsed ? collapsedWidth : siderWidth,
            transition: "all 0.2s ease 0s",
            ...style,
          }}
        />
      )}

      <Sider
        collapsible
        trigger={null}
        collapsed={collapsed}
        // breakpoint={breakpoint === false ? undefined : breakpoint}
        onCollapse={(collapse) => {
          if (isMobile) return;
          onCollapse?.(collapse);
        }}
        collapsedWidth={collapsedWidth}
        style={{
          overflow: "hidden",
          paddingTop: layout === "mix" && !isMobile ? headerHeight : undefined,
          ...style,
        }}
        theme={theme}
        width={siderWidth}
        className={classNames(siderClassName, hideMenuWhenCollapsedClassName)}
      >
        {hideMenuWhenCollapsedClassName ? (
          <div
            className={`${baseClassName}-hide-when-collapsed`}
            style={{
              height: "100%",
              width: "100%",
              opacity: hideMenuWhenCollapsedClassName ? 0 : 1,
            }}
          >
            {menuDomItems}
          </div>
        ) : (
          menuDomItems
        )}
        {collapsedDom}
      </Sider>
    </>
  );
};

export { SiderMenu };
