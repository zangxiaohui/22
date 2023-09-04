import classNames from "classnames";
import React, { CSSProperties } from "react";
import { PureSettings } from "../../layouts/defaultSettings";
// import RouteContext from '../RouteContext';
import "./index.less";

interface GridContentProps {
  contentWidth?: PureSettings["contentWidth"];
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  prefixCls?: string;
}

/**
 * This component can support contentWidth so you don't need to calculate the width
 * contentWidth=Fixed, width will is 1200
 * @param props
 */
const GridContent: React.FC<GridContentProps> = (props) => {
  // const value = useContext(RouteContext);
  const {
    children,
    contentWidth: propsContentWidth,
    className: propsClassName,
    style,
    prefixCls = "ant-pro",
  } = props;
  const contentWidth = propsContentWidth || 1188;
  let className = `${prefixCls}-grid-content`;
  if (contentWidth === "Fixed") {
    className = `${prefixCls}-grid-content wide`;
  }
  return (
    <div className={classNames(className, propsClassName)} style={style}>
      <div className={`${prefixCls}-grid-content-children`}>{children}</div>
    </div>
  );
};

export default GridContent;
