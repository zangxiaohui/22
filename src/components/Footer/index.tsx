import { Layout } from "antd";
import type { CSSProperties } from "react";
import React from "react";
import GlobalFooter from "../GlobalFooter";

const { Footer } = Layout;

export type FooterProps = {
  style?: CSSProperties;
  className?: string;
  prefixCls?: string;
};

const FooterView: React.FC<FooterProps> = ({
  style,
  className,
  prefixCls,
}: FooterProps) => (
  <Footer className={className} style={{ padding: 0, ...style }}>
    <GlobalFooter prefixCls={prefixCls} />
  </Footer>
);

export default FooterView;
