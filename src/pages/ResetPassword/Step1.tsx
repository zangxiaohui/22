import { Button, Col, Form, Input, Row } from "antd";
import React, { useCallback, useState } from "react";
// import styles from "./index.module.scss";
import { useSMSToken } from "../../components/SendSMSToken";
import { useSubmission } from "../../lib/hooks";
import { getVerifyCellphoneToken } from "../../services/login";

const { useForm } = Form;

export interface ResetPasswordStep1Props {
  onStepFinish: (result: ResetPasswordStep1Result) => void;
}

export interface ResetPasswordStep1Result {
  cellphone: string;
  token: string;
}

const ResetPasswordStep1: React.FC<ResetPasswordStep1Props> = (props) => {
  const { onStepFinish } = props;
  const [form] = useForm();
  const [doSubmit, submitting] = useSubmission();
  const { canSendSMS, sendSMS, smsSending, smsCoolDown, setCellphone } =
    useSMSToken();

  const submit = async (values: any): Promise<void> => {
    const cellphone: string = values.cellphone;
    const code: string = values.code;
    const response = await doSubmit(() =>
      getVerifyCellphoneToken(cellphone, code)
    );
    if (!response) return;
    onStepFinish({
      cellphone: cellphone,
      token: response.token,
    });
  };

  const [allFieldsComplete, setAllFieldsComplete] = useState(false);
  const updateFormComplete = useCallback(() => {
    setAllFieldsComplete(Object.values(form.getFieldsValue()).every((x) => x));
  }, [form]);

  return (
    <Form
      form={form}
      layout="horizontal"
      onFinish={submit}
      onValuesChange={updateFormComplete}
    >
      <Form.Item
        name="cellphone"
        rules={[
          { required: true, message: "手机号码不能为空" },
          { pattern: /^\d{0,11}$/, message: "手机号码格式不正确" },
        ]}
      >
        <Input
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
              <Input placeholder="请输入验证码" autoComplete="one-time-code" />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Button
              type="primary"
              onClick={sendSMS}
              disabled={!canSendSMS}
              loading={smsSending}
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
      {/* <Captcha className={styles.captcha}/> */}
      <Button
        htmlType="submit"
        type="primary"
        block
        disabled={submitting || !allFieldsComplete}
        loading={submitting}
      >
        提交
      </Button>
    </Form>
  );
};

export default ResetPasswordStep1;
