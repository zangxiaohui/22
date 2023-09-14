import { Space } from "antd";
import React from "react";

import {
  LoginOutlined,
  PhoneOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useAsync } from "../../lib/hooks";
import { getTelInfo } from "../../services/user";
import RegisterForm from "./RegisterForm";
import styles from "./index.module.scss";

const Register: React.FC = () => {
  const telData = useAsync(getTelInfo);
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.mod}>
          <div className={styles.hd}>
            <div className={styles.title}>百川股份招标系统</div>
            <div className={styles.subTitle}>欢迎注册</div>
          </div>
          <div className={styles.bd}>
            <RegisterForm />
          </div>
          <div className={styles.ft}>
            <Space size={40}>
              <Link to="/client/forgot-password">
                <QuestionCircleOutlined />
                忘记密码？
              </Link>
              <Link to="/client/login">
                <LoginOutlined />
                已有账号，直接登录
              </Link>
              {telData?.data?.Con && (
                <span>
                  <PhoneOutlined />
                  {telData?.data?.Con}
                </span>
              )}
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
