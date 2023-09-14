import { Button, Form, Input, Modal } from "antd";
import React from "react";
import { useHistory } from "react-router-dom";
import { useSubmission } from "../../lib/hooks";
import { forgotResetPassword } from "../../services/login";
import { ResetPasswordStep1Result } from "./Step1";

const { useForm } = Form;

export interface ResetPasswordStep2Props {
  prevStepResult: ResetPasswordStep1Result;
}

const ResetPasswordStep2: React.FC<ResetPasswordStep2Props> = (props) => {
  const { prevStepResult } = props;
  const [form] = useForm();
  const [doSubmit, submitting] = useSubmission();
  const history = useHistory();

  const submit = async (values: any): Promise<void> => {
    await doSubmit(async () => {
      const res = await forgotResetPassword({
        phone: prevStepResult.cellphone,
        UserName: prevStepResult.userName,
        SMSCode: prevStepResult.code,
        pwd: values.newPassword,
      });
      if (res?.state) {
        Modal.success({
          title: `重置密码成功！`,
          okText: "返回登录",
          onOk() {
            history.push("/client/login");
          },
        });
      } else {
        Modal.error({
          title: res?.msg,
          okText: "关闭",
          width: 440,
        });
      }
    });
  };

  return (
    <Form form={form} layout="horizontal" onFinish={submit}>
      <Form.Item
        name="newPassword"
        rules={[
          { required: true, message: "请输入新密码" },
          {
            pattern: /^(?=[a-zA-Z]*[0-9])(?=[0-9]*[a-zA-Z])[a-zA-Z0-9]{6,}$/,
            message: "密码不少于6位，需同时包含字母和数字",
          },
        ]}
      >
        <Input
          allowClear
          size="large"
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
          { required: true, message: "请输入确认密码" },
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
          allowClear
          size="large"
          type="password"
          autoComplete="new-password"
          placeholder="确认密码"
        />
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
  );
};

export default ResetPasswordStep2;
