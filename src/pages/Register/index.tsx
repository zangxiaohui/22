import React from "react";
import RegisterForm from "./RegisterForm";
import styles from "./index.module.scss";

const Register: React.FC = () => {
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
            <span>忘记密码？</span>
            <span>已有账号，直接登录</span>
            <span>如有疑问请联系 4008-888-8888</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
