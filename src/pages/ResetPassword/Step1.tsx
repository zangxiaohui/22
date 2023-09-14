import { Button, Col, Form, Input, Row } from "antd";
import React, { useState } from "react";
// import styles from "./index.module.scss";
import { useSMSToken } from "../../components/SendSMSToken";
import { useSubmission } from "../../lib/hooks";
import ValidCodeModal from "../Register/ValidCodeModal";

const { useForm } = Form;

export interface ResetPasswordStep1Props {
  onStepFinish: (result: ResetPasswordStep1Result) => void;
}

export interface ResetPasswordStep1Result {
  cellphone: string;
  code: string;
  userName: string;
}

const ResetPasswordStep1: React.FC<ResetPasswordStep1Props> = (props) => {
  const { onStepFinish } = props;
  const [form] = useForm();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { canSendSMS, sendSMS, smsSending, smsCoolDown, setCellphone } =
    useSMSToken();

  const userName = Form.useWatch("userName", form);

  const [doSubmit, submitting] = useSubmission();

  const submit = async (values: any): Promise<void> => {
    onStepFinish(values);
  };

  const handleCaptcha = async (values: any) => {
    await sendSMS({
      ...values,
      UserName: userName,
    });
    setModalVisible(false);
  };

  return (
    <>
      <Form form={form} layout="horizontal" onFinish={submit}>
        <Form.Item
          name="userName"
          rules={[{ required: true, message: "账号不能为空" }]}
        >
          <Input allowClear size="large" placeholder="请输入账号" />
        </Form.Item>

        <Form.Item
          name="cellphone"
          rules={[
            { required: true, message: "手机号码不能为空" },
            { pattern: /^\d{0,11}$/, message: "手机号码格式不正确" },
          ]}
        >
          <Input
            allowClear
            size="large"
            placeholder="请输入手机号"
            autoComplete="tel"
            onChange={(e) => setCellphone(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Row>
            <Col span={14}>
              <Form.Item
                name="code"
                noStyle
                rules={[
                  { required: true, message: "验证码不能为空" },
                  { whitespace: true, message: "验证码不能为空字符" },
                ]}
              >
                <Input
                  placeholder="请输入验证码"
                  autoComplete="one-time-code"
                  allowClear
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={5} offset={1}>
              <Button
                type="primary"
                onClick={() => {
                  setModalVisible(true);
                }}
                disabled={!canSendSMS || !userName}
                loading={smsSending}
                size="large"
              >
                {smsSending
                  ? "发送中"
                  : smsCoolDown > 0
                  ? `${smsCoolDown}秒后可重发`
                  : "获取验证码"}
              </Button>
            </Col>
          </Row>
        </Form.Item>
        <Button
          htmlType="submit"
          type="primary"
          block
          disabled={submitting}
          loading={submitting}
          size="large"
        >
          提交
        </Button>
      </Form>
      <ValidCodeModal
        modalVisible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOK={handleCaptcha}
      />
    </>
  );
};

export default ResetPasswordStep1;
