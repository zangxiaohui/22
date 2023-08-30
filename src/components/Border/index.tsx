import React from "react";
import { Card } from 'antd';
import { CardProps } from "antd/lib/card";
import { useData } from "../../layouts/SubviewContext";
import styles from './index.module.scss';

export interface BorderProps extends CardProps {

}

const Border: React.FC<BorderProps> = (props) => {
  const data = useData();
  return (
    <div className={styles.border}>
      <Card
        {...props}
        bordered={false}
      />
    </div>
  );
};

export default Border;
