import { Button, Result } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import styles from "../Register/index.module.scss";
import "./index.less";

export type LocationState = Record<string, unknown>;

const RegisterResult: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.mod}>
          <div className={styles.hd}>
            <div className={styles.title}>百川股份招标系统</div>
            <div className={styles.subTitle}>欢迎注册</div>
          </div>
          <div className={styles.bd} style={{ background: "#eee" }}>
            <Result
              className="register-result"
              status="success"
              title={<div className="register-title">注册成功，等待审核</div>}
              subTitle="说明文字说明文字"
              extra={
                <div className="register-actions">
                  <Link to="/client/login">
                    <Button size="large">返回登录</Button>
                  </Link>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterResult;
