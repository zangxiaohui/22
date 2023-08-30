import React from "react";
import Helmet from "react-helmet";
import LoginForm from "./LoginForm";
import styles from "./index.module.scss";

const Login: React.FC = () => {
  return (
    <div className={styles.loginPage}>
      <Helmet>
        <title>登录</title>
      </Helmet>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.wrapper}>
            <div className={styles.colLeft}>
              <div className={styles.logo}></div>
              <div className={styles.headerTitle}>USER LOGIN</div>
              <div className={styles.headerSubTitle}>欢迎登录</div>
            </div>
            <div className={styles.colRight}>
              <div className={styles.cardForm}>
                <div className={styles.cardFormHd}>百川股份招标系统</div>
                <div className={styles.cardFormBd}>
                  <LoginForm />
                </div>
                <div className={styles.cardFormFt}>
                  请在上方输入用户名、密码。如有问题请联系管理员
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className={styles.bottomText}>
        <a href="https://beian.miit.gov.cn/#/Integrated/index">
          沪ICP备15053420号-1
        </a>
      </p>
    </div>
  );
};

export default Login;
