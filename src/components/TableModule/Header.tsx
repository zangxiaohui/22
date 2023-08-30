import React from "react";
import styles from "./index.module.scss"

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = (props) => {
  const { title } = props;
  return (
    <div className={styles.header}>
      <span className={styles.title}>{title}</span>
      <div className={styles.inline}>
        {props.children}
      </div>
    </div>
  );
};

export default Header;
