import { Space } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import ResetPasswordStep1, { ResetPasswordStep1Result } from "./Step1";
import ResetPasswordStep2 from "./Step2";
import styles from "./index.module.scss";

enum Step {
  STEP_1,
  STEP_2,
}

const ResetPassword: React.FC = () => {
  const [step, setStep] = useState(Step.STEP_1);
  const [step1Result, setStep1Result] = useState<ResetPasswordStep1Result>();

  const finishStep1 = (result: ResetPasswordStep1Result): void => {
    setStep1Result(result);
    setStep(Step.STEP_2);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.mod}>
          <div className={styles.hd}>
            <div className={styles.title}>百川股份招标系统</div>
            <div className={styles.subTitle}>忘记密码</div>
          </div>
          <div className={styles.bd}>
            {step === Step.STEP_1 ? (
              <ResetPasswordStep1 onStepFinish={finishStep1} />
            ) : step === Step.STEP_2 && step1Result ? (
              <ResetPasswordStep2 prevStepResult={step1Result} />
            ) : null}
          </div>
          <div className={styles.ft}>
            <Space size={40}>
              <Link to="/client/login">返回登录</Link>
              <span>如有疑问请联系 4008-888-8888</span>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
