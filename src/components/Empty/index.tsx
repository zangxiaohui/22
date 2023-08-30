import { Empty as AntEmpty } from "antd";
import React from "react";
import emptyImg from "../../assets/images/empty.svg";
import styles from "./index.module.scss";

export default () => (
  <div className={styles.footer}>
    <AntEmpty description="暂无图片" image={<img src={emptyImg} alt="" />} />
  </div>
);
