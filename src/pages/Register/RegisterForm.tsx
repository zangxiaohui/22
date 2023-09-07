import { Button, Col, Form, Input, Modal, Row } from "antd";
import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { useLoginSMSToken } from "../../components/SendSMSToken";
import { register } from "../../services/login";
import styles from "./index.module.scss";

const { useForm } = Form;

const commonPhoneRegex = /^(?:1\d{10}|0\d{2,3}-?\d{7,8})$/;

interface CodeParams {
  cellphone: string;
  code: string;
}

const Login: React.FC = () => {
  const [form] = useForm();
  const [err, setErr] = useState<string>("");
  const history = useHistory();

  const { canSendSMS, sendSMS, smsSending, smsCoolDown, setCellphone } =
    useLoginSMSToken();

  const errorHandler = useCallback(
    (e: Response | any, defaultDesc = "请输入正确的账号或手机号和密码。") => {
      if (e.status === 403) {
        // setErr('这个账户被禁用了。');
        Modal.warning({
          className: styles.modal,
          content: (
            <div style={{ width: 250 }}>
              您的账号已禁用，请核实是否输入错误或联系管理员进行开通。
            </div>
          ),
          icon: null,
          okText: "关闭",
          mask: false,
        });
      }
      if (e.status === 423) {
        // 跳转页面
        // setErr('这个账户被冻结了。');
        Modal.warning({
          className: styles.modal,
          content: (
            <div style={{ width: 250 }}>
              您的账号已冻结，请核实是否输入错误或联系管理员进行开通。
            </div>
          ),
          icon: null,
          okText: "关闭",
          mask: false,
        });
        // history.push('/activate?back=true');
      }
      if (e.status === 401) {
        setErr(defaultDesc);
      }
      return;
    },
    []
  );

  const onPassFinish = (values: any) => {
    const { cellphone, password, code, ...rest } = values;
    console.log(values);

    register({
      phone: cellphone,
      // SMSCode: code,
      pwd: password,
      ...rest,
    })
      .then((res) => {
        Modal.success({
          title: `注册成功！`,
          content: "请等待账号审核",
          okText: "返回登录",
          onOk() {
            history.push("/client/login");
          },
        });
      })
      .catch((e) => {
        errorHandler(e);
      });
  };

  return (
    <Form layout="vertical" form={form} onFinish={onPassFinish}>
      <Row>
        <Col span={14} className={styles.colLeft}>
          <div className={styles.cardFormTitle}>个人信息</div>
          <div className={styles.cardFormBody}>
            <Form.Item
              label="手机号  *必填"
              name="cellphone"
              rules={[
                {
                  pattern: commonPhoneRegex,
                  message: "请输入正确的手机号",
                },
                { required: true, message: "手机号不能为空" },
              ]}
            >
              <Input
                placeholder="手机号"
                size="large"
                autoComplete="off"
                onChange={(e) => setCellphone(e.target.value)}
              />
            </Form.Item>

            <Form.Item label="手机验证  *必填">
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item
                    name="code"
                    noStyle
                    rules={[{ required: true, message: "验证码不能为空" }]}
                  >
                    <Input
                      placeholder="输入验证码"
                      size="large"
                      autoComplete="off"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Button
                    onClick={sendSMS}
                    // disabled={!canSendSMS}
                    loading={smsSending}
                    size="large"
                    type="primary"
                    danger
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

            <Form.Item
              label="密码  *必填"
              name="password"
              rules={[
                { required: true, message: "密码不能为空" },
                { whitespace: true, message: "密码不能为空字符" },
              ]}
            >
              <Input.Password placeholder="密码" size="large" />
            </Form.Item>
            <Form.Item
              label="确认密码  *必填"
              name="passwordRepeat"
              validateFirst={true}
              validateTrigger={["onChange", "onBlur"]}
              rules={[
                { required: true, message: "请输入确认密码" },
                (form) => {
                  const pwd = form.getFieldValue("password");
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
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="realname"
              label="姓名  *必填"
              rules={[{ required: true, message: "姓名不能为空" }]}
            >
              <Input placeholder="请输入姓名" size="large" />
            </Form.Item>

            <Form.Item
              name="email"
              label="邮箱  *必填"
              rules={[{ required: true, message: "邮箱不能为空" }]}
            >
              <Input placeholder="请输入邮箱" size="large" />
            </Form.Item>
          </div>
        </Col>
        <Col span={9} offset={1}>
          <div className={styles.cardFormTitle}>企业信息</div>
          <Form.Item
            name="company"
            label="公司名称  *必填"
            rules={[{ required: true, message: "公司名称不能为空" }]}
          >
            <Input placeholder="请输入公司名称" size="large" />
          </Form.Item>
          <Form.Item
            name="nsrsbh"
            label="纳税人识别号  *必填"
            rules={[{ required: true, message: "纳税人识别号不能为空" }]}
          >
            <Input placeholder="请输入纳税人识别号" size="large" />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              className={styles.button}
              size="large"
              type="primary"
              danger
              block
            >
              注册
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default Login;
