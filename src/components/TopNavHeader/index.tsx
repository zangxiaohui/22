import { ConfigProvider } from "antd";
import classNames from "classnames";
import React, { useContext, useMemo, useRef } from "react";
import type { GlobalHeaderProps } from "../GlobalHeader";
import { ActionsContent } from "../GlobalHeader/ActionsContent";
import { BaseMenu } from "../SiderMenu/BaseMenu";
import type {
  HeaderRenderKey,
  PrivateSiderMenuProps,
  SiderMenuProps,
} from "../SiderMenu/SiderMenu";
import { renderLogoAndTitle } from "../SiderMenu/SiderMenu";

export type TopNavHeaderProps = SiderMenuProps &
  GlobalHeaderProps &
  PrivateSiderMenuProps;

const TopNavHeader: React.FC<TopNavHeaderProps> = (
  props: TopNavHeaderProps
) => {
  const ref = useRef(null);
  const {
    onMenuHeaderClick,
    contentWidth,
    rightContentRender,
    className: propsClassName,
    style,
    headerContentRender,
    layout,
    actionsRender,
  } = props;
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const dark = false;

  const prefixCls = `${props.prefixCls || getPrefixCls("pro")}-top-nav-header`;

  let renderKey: HeaderRenderKey | undefined = undefined;
  if (props.menuHeaderRender !== undefined) {
    renderKey = "menuHeaderRender";
  } else if (layout === "mix" || layout === "top") {
    renderKey = "headerTitleRender";
  }
  const headerDom = renderLogoAndTitle(
    { ...props, collapsed: false },
    renderKey
  );
  const contentDom = useMemo(() => {
    const defaultDom = (
      <BaseMenu
        theme={dark ? "dark" : "light"}
        {...props}
        className={`${prefixCls}-base-menu `.trim()}
        {...props.menuProps}
        style={{
          width: "100%",
          ...props.menuProps?.style,
        }}
        collapsed={false}
        menuRenderType="header"
        mode="horizontal"
      />
    );

    if (headerContentRender) {
      return headerContentRender(props, defaultDom);
    }
    return defaultDom;
  }, [dark, props, prefixCls, headerContentRender]);

  return (
    <div
      className={classNames(prefixCls, propsClassName, {
        [`${prefixCls}-light`]: true,
      })}
      style={style}
    >
      <div
        ref={ref}
        className={classNames(`${prefixCls}-main`, {
          [`${prefixCls}-wide`]: contentWidth === "Fixed",
        })}
      >
        {headerDom && (
          <div
            className={classNames(`${prefixCls}-main-left`)}
            onClick={onMenuHeaderClick}
          >
            <div className={`${prefixCls}-logo `.trim()} key="logo" id="logo">
              {headerDom}
            </div>
          </div>
        )}
        <div style={{ flex: 1 }} className={`${prefixCls}-menu `.trim()}>
          {contentDom}
        </div>
        {(rightContentRender || actionsRender || props.avatarProps) && (
          <ActionsContent
            rightContentRender={rightContentRender}
            {...props}
            prefixCls={prefixCls}
          />
        )}
      </div>
    </div>
  );
};

export { TopNavHeader };
