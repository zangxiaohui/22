import { Button, Form } from "antd";
import React from "react";
import styles from "./index.module.scss";

const { useForm } = Form;

const Dashboard: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <Button type="primary">22</Button>
    </div>
  );
};

export default Dashboard;
