import { Button, Form, Input, message, Modal } from "antd";
import React from "react";
import { updatePwd } from "../../services/user";

const { useForm } = Form;

const ModifyPassword: React.FC = () => {
  const [form] = useForm();

  const submit = async (values: any) => {
    const res = await updatePwd({
      pwd1: values.pwd1,
      pwd2: values.newPassword,
    });
    if (res?.state) {
      message.success("修改成功");
    } else {
      Modal.error({
        title: res?.msg,
        okText: "关闭",
        width: 440,
      });
    }
  };

  return (
    <Form form={form} onFinish={submit}>
      <Form.Item
        label="原密码"
        name="pwd1"
        rules={[{ required: true, message: "请输入原密码" }]}
      >
        <Input.Password placeholder="请输入原密码" allowClear size="large" />
      </Form.Item>

      <Form.Item
        label="新密码"
        name="newPassword"
        rules={[
          { required: true, message: "请输入新密码" },
          {
            pattern: /^(?=[a-zA-Z]*[0-9])(?=[0-9]*[a-zA-Z])[a-zA-Z0-9]{6,}$/,
            message: "密码不少于6位，需同时包含字母和数字",
          },
        ]}
      >
        <Input.Password placeholder="请输入新密码" allowClear size="large" />
      </Form.Item>
      <Form.Item
        label="确认新密码"
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
        <Input.Password placeholder="确认密码" allowClear size="large" />
      </Form.Item>
      <Form.Item className="btn-area">
        <Button htmlType="submit" type="primary" block size="large">
          修改
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ModifyPassword;
