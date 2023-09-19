import { ConfigProvider, Drawer } from "antd";
import classNames from "classnames";
import Omit from "omit.js";
import React, { useEffect } from "react";
import type { PrivateSiderMenuProps, SiderMenuProps } from "./SiderMenu";
import { SiderMenu } from "./SiderMenu";

const SiderMenuWrapper: React.FC<SiderMenuProps & PrivateSiderMenuProps> = (
  props
) => {
  const {
    isMobile,
    siderWidth,
    collapsed,
    onCollapse,
    style,
    className,
    hide,
    prefixCls,
  } = props;

  useEffect(() => {
    if (isMobile === true) {
      onCollapse?.(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  const omitProps = Omit(props, ["className", "style"]);

  const { direction } = React.useContext(ConfigProvider.ConfigContext);

  const siderClassName = classNames(`${prefixCls}-sider`, className);

  if (hide) {
    return null;
  }

  const drawerOpenProps = {
    open: !collapsed,
    onVisibleChange: () => onCollapse?.(true),
  };

  return isMobile ? (
    <Drawer
      placement={direction === "rtl" ? "right" : "left"}
      className={classNames(`${prefixCls}-drawer-sider`, className)}
      {...drawerOpenProps}
      style={{
        padding: 0,
        height: "100vh",
        ...style,
      }}
      onClose={() => {
        onCollapse?.(true);
      }}
      maskClosable
      closable={false}
      width={siderWidth}
      bodyStyle={{
        height: "100vh",
        padding: 0,
        display: "flex",
        flexDirection: "row",
      }}
    >
      <SiderMenu
        {...omitProps}
        isMobile={true}
        className={siderClassName}
        collapsed={isMobile ? false : collapsed}
        splitMenus={false}
        originCollapsed={collapsed}
      />
    </Drawer>
  ) : (
    <SiderMenu
      className={siderClassName}
      originCollapsed={collapsed}
      {...omitProps}
      style={style}
    />
  );
};

export { SiderMenuWrapper as SiderMenu };
