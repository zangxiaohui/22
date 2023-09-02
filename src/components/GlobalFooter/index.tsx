/* eslint-disable import/no-anonymous-default-export */
import { ConfigProvider } from "antd";
import classNames from "classnames";
import React, { useContext } from "react";
import "./index.less";

export type GlobalFooterProps = {
  style?: React.CSSProperties;
  prefixCls?: string;
  className?: string;
};

export default ({ className, prefixCls, style }: GlobalFooterProps) => {
  const context = useContext(ConfigProvider.ConfigContext);
  const baseClassName = context.getPrefixCls(prefixCls || "pro-global-footer");

  const clsString = classNames(baseClassName, className);
  return (
    <div className={clsString} style={style}>
      <div className={`${baseClassName}-copyright`}>
        Copyright © 2023 百川股份 All Rights Reserved.
      </div>
    </div>
  );
};
