import { Button, Form, Input } from "antd";
import React, { useCallback, useState } from "react";
import { useSubmission } from "../../lib/hooks";
import { gotoReferrerByQueryParam } from "../../lib/util";
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

  const submit = async (values: any): Promise<void> => {
    await doSubmit(async () => {
      await forgotResetPassword({
        cellphone: prevStepResult.cellphone,
        token: prevStepResult.token,
        newPassword: values.newPassword,
      });
      await gotoReferrerByQueryParam(
        "密码重置成功，正在跳转回原页面",
        "密码重置成功，请关闭此窗口并重新登录"
      );
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
        name="newPassword"
        rules={[
          { required: true, message: "请输入新密码" },
          {
            pattern: /^(?=[a-zA-Z]*[0-9])(?=[0-9]*[a-zA-Z])[a-zA-Z0-9]{8,}$/,
            message: "密码不少于8位，需同时包含字母和数字",
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
        提交
      </Button>
    </Form>
  );
};

export default ResetPasswordStep2;
