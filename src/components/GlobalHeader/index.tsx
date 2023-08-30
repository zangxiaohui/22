import { Select } from "antd";
import React from "react";
import { UserInfoProps } from "./UserInfo";
import styles from "./index.module.scss";

const { Option } = Select;

interface GlobalHeaderProps extends UserInfoProps {
  projectList?: string[];
  forceUpdate?: () => void;
}

const GlobalHeader: React.FC<GlobalHeaderProps> = (props) => {
  return <div className={styles.header}>1232</div>;
};

export default GlobalHeader;
