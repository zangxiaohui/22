import {
  DownOutlined,
  LogoutOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import { Dropdown, Menu, Spin } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import styles from "./index.module.scss";

export interface UserInfoProps {
  userData?: any;
}

const UserInfo: React.FC<UserInfoProps> = ({ userData }) => {
  if (userData === undefined) {
    return <Spin className={styles.loading} />;
  }

  const { isAdmin } = userData || {};
  const username = userData?.name || "";
  const welcomeName = isAdmin ? "管理员" : username;

  const dropMenu = (
    <Menu className={styles.dropMenu}>
      <Menu.Item className={styles.dropMenuItem} key="1">
        <Link to="/compensate">
          <OrderedListOutlined />
          <span className={styles.text}>数据补偿</span>
        </Link>
      </Menu.Item>
      <Menu.Item className={styles.dropMenuItem} key="logout">
        <a
          href="/login"
          onClick={() => {
            localStorage.removeItem("xyz-authority");
          }}
        >
          <LogoutOutlined />
          <span className={styles.text}>退出</span>
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.userInfoContainer}>
      <div className={styles.welcomeContent}>
        <div className={styles.defaultUserIcon} />
        <Dropdown overlay={dropMenu}>
          <div className={styles.dropdownContainer}>
            <div className={styles.menuDropdown}>
              <div className={styles.welcomeText}>{`你好！${welcomeName}`}</div>
            </div>
            <DownOutlined className={styles.dropIcon} />
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default UserInfo;
