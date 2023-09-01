import { Alert, Button, Col, Form, Input, Row } from "antd";
import React, { useCallback, useState } from "react";
import { useSMSToken } from "../../components/SendSMSToken";
import { useSubmission } from "../../lib/hooks";
import { goBackByQueryParam } from "../../lib/util";
import {
  ActivateResetPasswordRequest,
  activateResetPassword,
} from "../../services/login";
import styles from "./index.module.scss";

const { useForm } = Form;

const Activation: React.FC = () => {
  const [form] = useForm();
  const [doSubmit, submitting] = useSubmission();
  const { canSendSMS, sendSMS, smsSending, smsCoolDown, setCellphone } =
    useSMSToken();

  const [allFieldsComplete, setAllFieldsComplete] = useState(false);
  const updateFormComplete = useCallback(() => {
    setAllFieldsComplete(Object.values(form.getFieldsValue()).every((x) => x));
  }, [form]);

  const submit = async (values: any): Promise<void> => {
    const request: ActivateResetPasswordRequest = {
      cellphone: values.cellphone,
      code: values.code,
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    };
    await doSubmit(async () => {
      await activateResetPassword(request);
      await goBackByQueryParam(
        "激活成功，正在跳转回原页面",
        "激活成功，请关闭此窗口并重新登录"
      );
    });
  };

  return (
    <div className={styles.wrapper}>
      <Alert
        message="请注意，基于安全的原因，您需要重新设置密码&emsp;"
        type="warning"
        showIcon
        closable
        className={styles.alertMessage}
      />
      <div className={styles.dialog}>
        <h1 className={styles.title}>安全认证</h1>
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
                  <Input
                    placeholder="请输入验证码"
                    autoComplete="one-time-code"
                  />
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
          <Form.Item
            name="oldPassword"
            rules={[{ required: true, message: "原密码不能为空" }]}
          >
            <Input
              type="password"
              autoComplete="one-time-code"
              placeholder="请输入原密码"
            />
          </Form.Item>
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: "新密码不能为空" },
              {
                pattern: /^(?=.{6,})(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/,
                message: "密码不少于6位，需同时包含大小写字母和数字",
              },
            ]}
          >
            <Input
              type="password"
              autoComplete="new-password"
              placeholder="请输入新密码"
            />
          </Form.Item>
          <Form.Item
            name="passwordRepeat"
            validateFirst={true}
            validateTrigger={["onChange", "onBlur"]}
            rules={[
              { required: true, message: "确认密码不能为空" },
              (form) => {
                const pwd = form.getFieldValue("newPassword");
                return {
                  type: "string",
                  validator: (rule, value) =>
                    value === pwd
                      ? Promise.resolve()
                      : Promise.reject("两次输入密码不一致，请重新输入"),
                  validateTrigger: "onBlur",
                };
              },
            ]}
          >
            <Input
              type="password"
              autoComplete="new-password"
              placeholder="确认密码"
            />
          </Form.Item>
          <Button
            htmlType="submit"
            type="primary"
            block
            disabled={submitting || !allFieldsComplete}
            loading={submitting}
          >
            确认
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Activation;
