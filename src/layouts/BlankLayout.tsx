import { Layout } from "antd";
import React, { PropsWithChildren } from "react";

interface BlankLayouts {}

const BlankLayout: React.FC<PropsWithChildren<BlankLayouts>> = ({
  children,
}) => {
  return (
    <>
      <Layout.Content>{children}</Layout.Content>
    </>
  );
};

export default BlankLayout;
