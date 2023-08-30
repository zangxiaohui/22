import React, {useState} from "react";
import ResetPasswordStep1, {ResetPasswordStep1Result} from "./Step1";
import ResetPasswordStep2 from "./Step2";
import styles from "./index.module.scss";
import Helmet from "react-helmet";

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
  }

  return (
    <div className={styles.wrapper}>
      <Helmet>
        <title>找回密码</title>
      </Helmet>
      <div className={styles.dialog}>
        <h1 className={styles.title}>忘记密码</h1>
        {
          step === Step.STEP_1 ?
            <ResetPasswordStep1 onStepFinish={finishStep1}/> :
          step === Step.STEP_2 && step1Result ?
            <ResetPasswordStep2 prevStepResult={step1Result}/> :
          null
        }
      </div>
    </div>
  )
}

export default ResetPassword;
