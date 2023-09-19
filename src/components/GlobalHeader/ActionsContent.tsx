import {
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ConfigProvider, Divider, Dropdown, Space, Spin } from "antd";
import type { MenuInfo } from "rc-menu/lib/interface";
import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import type { GlobalHeaderProps } from ".";
import { useSelf } from "../../layouts/RouteContext";
import { logout } from "../../services/login";
/**
 * 抽离出来是为了防止 rightSize 经常改变导致菜单 render
 *
 * @param param0
 */
export const ActionsContent: React.FC<GlobalHeaderProps> = ({
  rightContentRender,
  avatarProps,
  actionsRender,
  headerContentRender,
  isMobile,
  ...props
}) => {
  const history = useHistory();
  const currentUser = useSelf();
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = `${getPrefixCls()}-pro-global-header`;

  const clickLogout = async () => {
    await logout();
    localStorage.removeItem("baichuan_info");
    localStorage.removeItem("baichuan_openid");
    localStorage.removeItem("baichuan_curtoken");
    history.push("/client/login");
  };

  const onMenuClick = (event: MenuInfo) => {
    const { key } = event;
    if (key === "logout") {
      clickLogout();
      return;
    } else if (key === "settings") {
      history.push("/client/account/manage-company");
    }
  };

  const menuItems = [
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "管理信息",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
    },
  ];

  if (!currentUser?.RealName) {
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <Spin />
      </div>
    );
  }

  const HeaderDropdown = (
    <Dropdown
      menu={{
        onClick: onMenuClick,
        items: menuItems,
      }}
      trigger={["click"]}
    >
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <span className="avatar-icon">
            <UserOutlined />
          </span>
          <span className="username">{currentUser?.RealName}</span>
          <DownOutlined />
        </Space>
      </a>
    </Dropdown>
  );

  return (
    <div className={`${prefixCls}-right-content`}>
      {isMobile ? (
        HeaderDropdown
      ) : (
        <>
          <span className="avatar-icon">
            <UserOutlined />
          </span>
          <span className="username">{currentUser?.RealName}</span>，
          您好！您可以：
          <Link to="/client/account/manage-company">管理信息</Link>
          <Divider type="vertical" />
          <a onClick={clickLogout}>退出登录</a>
        </>
      )}
    </div>
  );
};
