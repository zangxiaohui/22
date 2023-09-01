/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */

import { HeartTwoTone } from "@ant-design/icons";
import ProLayout, {
  DefaultFooter,
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from "@ant-design/pro-layout";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import logo from "../assets/images/logo.svg";
import defaultSettings from "../config/defaultSetting";

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
}
export type BasicLayoutContext = { [K in "location"]: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const [collapsed, handleMenuCollapse] = useState<boolean>(false);
  const [settings, setSettings] = useState<Partial<Settings>>({
    ...defaultSettings,
    fixSiderbar: true,
  });
  const history = useHistory();
  return (
    <ProLayout
      logo={logo}
      menuHeaderRender={(logoDom, titleDom) => (
        <Link to="/">
          {logoDom}
          {titleDom}
        </Link>
      )}
      links={[
        <>
          <HeartTwoTone />
          <span>name</span>
        </>,
      ]}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) =>
        menuItemProps.isUrl ? (
          defaultDom
        ) : (
          <Link className="qixian-menuItem" to={menuItemProps.path || "/"}>
            {defaultDom}
          </Link>
        )
      }
      rightContentRender={() => [<span />]}
      collapsed={collapsed}
      onMenuHeaderClick={() => history.push("/")}
      footerRender={() => <DefaultFooter />}
      {...props}
      {...settings}
      menu={{
        defaultOpenAll: true,
      }}
    >
      {props.children}
    </ProLayout>
  );
};

export default BasicLayout;
