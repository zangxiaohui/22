import { Layout } from "antd";
import { isEqual } from "lodash";
import React from "react";
import { User } from "../../services/login";
import styles from "./index.module.scss";

const { Header } = Layout;

interface UserInfoProps {
  userData: User | undefined;
}

const UserInfo: React.FC<UserInfoProps> = ({ userData }) => {
  const welcomeName = userData?.name;
  console.log("isEqual :>> ", isEqual);

  return (
    <div className={styles.userInfoContainer}>
      <div className={styles.divider} />
      <div className={styles.welcomeContent}>
        <div className={styles.defaultUserIcon} />
        <div className={styles.dropdownContainer}>
          <div className={styles.menuDropdown}>
            <div className={styles.welcomeText}>{`你好！${welcomeName}`}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MenuHeaderProps extends UserInfoProps {}

const MenuHeader: React.FC<MenuHeaderProps> = ({ userData }) => {
  return (
    <Header className={styles.header}>
      <div className={styles.title}>客户中心</div>
      <UserInfo userData={userData} />
    </Header>
  );
};

export default MenuHeader;
