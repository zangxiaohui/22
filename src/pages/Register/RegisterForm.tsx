import { Button, Col, Form, Input, Modal, Result, Row } from "antd";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import mail from "../../assets/images/icons/envelope.svg";
import home from "../../assets/images/icons/home.svg";
import mobile from "../../assets/images/icons/mobile.svg";
import lock from "../../assets/images/icons/pwd.svg";
import user from "../../assets/images/icons/user.svg";
import { useRegisterSMSToken } from "../../components/SendSMSToken";
import { useSubmission } from "../../lib/hooks";
import { register } from "../../services/login";
import ValidCodeModal from "./ValidCodeModal";
import styles from "./index.module.scss";

const commonPhoneRegex = /^(?:1\d{10}|0\d{2,3}-?\d{7,8})$/;

interface CodeParams {
  cellphone: string;
  code: string;
}

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [doSubmit, submitting] = useSubmission();
  const [visible, setVisible] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [registerResult, setRegisterResult] = useState<string>();

  const { canSendSMS, sendSMS, smsSending, smsCoolDown, setCellphone } =
    useRegisterSMSToken();

  const onFinish = (values: any) => {
    doSubmit(async () => {
      const { cellphone, password, code, passwordRepeat, ...rest } = values;
      const res = await register({
        phone: cellphone,
        SMSCode: code,
        pwd: password,
        ...rest,
      });
      if (res?.state) {
        setRegisterResult(res?.msg);
        setVisible(true);
      } else {
        Modal.error({
          title: res?.msg,
          okText: "关闭",
          width: 440,
        });
      }
    });
  };

  const handleCaptcha = async (values: any) => {
    await sendSMS(values);
    setModalVisible(false);
  };

  return (
    <>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row gutter={30}>
          <Col xs={24} sm={24} md={24} lg={16} className={styles.colLeft}>
            <div className={styles.cardFormTitle}>个人信息</div>
            <div className={styles.cardFormBody}>
              <Row gutter={30}>
                <Col xs={24} sm={24} md={24} lg={12}>
                  <Form.Item
                    label="手机号  *必填"
                    name="cellphone"
                    rules={[
                      {
                        pattern: commonPhoneRegex,
                        message: "请填写正确的手机号",
                      },
                      { required: true, message: "手机号不能为空" },
                    ]}
                  >
                    <Input
                      allowClear
                      placeholder="请填写手机号"
                      size="large"
                      onChange={(e) => setCellphone(e.target.value)}
                      prefix={
                        <img
                          src={mobile}
                          className="basic-form-prefix-icon"
                          alt=""
                        />
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12}>
                  <Form.Item label="手机验证  *必填" required>
                    <Row gutter={8}>
                      <Col span={13}>
                        <Form.Item
                          name="code"
                          noStyle
                          rules={[
                            { required: true, message: "验证码不能为空" },
                          ]}
                        >
                          <Input
                            allowClear
                            placeholder="请填写验证码"
                            size="large"
                            prefix={
                              <img
                                src={lock}
                                className="basic-form-prefix-icon"
                                alt=""
                              />
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={11}>
                        <Button
                          // onClick={sendSMS}
                          onClick={() => {
                            setModalVisible(true);
                          }}
                          disabled={!canSendSMS}
                          loading={smsSending}
                          size="large"
                          type="primary"
                          className="btn-orange"
                          style={{
                            paddingLeft: 0,
                            paddingRight: 0,
                            width: 120,
                          }}
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
                </Col>
              </Row>

              <Row gutter={30}>
                <Col xs={24} sm={24} md={24} lg={12}>
                  <Form.Item
                    label="密码  *必填"
                    name="password"
                    rules={[
                      { required: true, message: "密码不能为空" },
                      {
                        pattern:
                          /^(?=[a-zA-Z]*[0-9])(?=[0-9]*[a-zA-Z])[a-zA-Z0-9]{6,}$/,
                        message: "密码不少于6位，需同时包含字母和数字",
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="请填写登录密码"
                      size="large"
                      allowClear
                      prefix={
                        <img
                          src={lock}
                          className="basic-form-prefix-icon"
                          alt=""
                        />
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12}>
                  <Form.Item
                    label="确认密码  *必填"
                    name="passwordRepeat"
                    validateFirst={true}
                    validateTrigger={["onChange", "onBlur"]}
                    rules={[
                      { required: true, message: "请填写确认密码" },
                      (form) => {
                        const pwd = form.getFieldValue("password");
                        return {
                          type: "string",
                          validator: (rule, value) =>
                            value === pwd
                              ? Promise.resolve()
                              : Promise.reject(
                                  "两次填写密码不一致，请重新填写"
                                ),
                          validateTrigger: "onBlur",
                        };
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="请确认登录密码"
                      size="large"
                      allowClear
                      prefix={
                        <img
                          src={lock}
                          className="basic-form-prefix-icon"
                          alt=""
                        />
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={30}>
                <Col xs={24} sm={24} md={24} lg={12}>
                  <Form.Item
                    name="realname"
                    label="姓名  *必填"
                    rules={[{ required: true, message: "姓名不能为空" }]}
                  >
                    <Input
                      placeholder="请填写您的姓名"
                      size="large"
                      allowClear
                      prefix={
                        <img
                          src={user}
                          className="basic-form-prefix-icon"
                          alt=""
                        />
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12}>
                  <Form.Item
                    name="email"
                    label="邮箱  *必填"
                    rules={[
                      { required: true, message: "邮箱不能为空" },
                      {
                        type: "email",
                        message: "请填写正确的邮箱",
                      },
                    ]}
                  >
                    <Input
                      placeholder="请填写您常用的邮箱"
                      size="large"
                      allowClear
                      prefix={
                        <img
                          src={mail}
                          className="basic-form-prefix-icon"
                          alt=""
                        />
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={8}>
            <div className={styles.cardFormTitle}>企业信息</div>
            <Form.Item
              name="company"
              label="公司名称  *必填"
              rules={[{ required: true, message: "公司名称不能为空" }]}
            >
              <Input
                placeholder="请填写公司名称"
                size="large"
                allowClear
                prefix={
                  <img src={home} className="basic-form-prefix-icon" alt="" />
                }
              />
            </Form.Item>
            <Form.Item
              name="nsrsbh"
              label="纳税人识别号  *必填"
              rules={[{ required: true, message: "纳税人识别号不能为空" }]}
            >
              <Input
                placeholder="请填写纳税人识别号"
                size="large"
                allowClear
                prefix={
                  <img src={home} className="basic-form-prefix-icon" alt="" />
                }
              />
            </Form.Item>
            <Form.Item className={styles.btnArea}>
              <Button
                htmlType="submit"
                size="large"
                type="primary"
                className="btn-orange"
                block
                loading={submitting}
                disabled={submitting}
              >
                注册
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Modal
        width={680}
        footer={null}
        title="注册成功"
        open={visible}
        onCancel={() => setVisible(false)}
      >
        <Result
          status="success"
          title="注册成功！"
          subTitle={registerResult}
          extra={[
            <Button
              type="primary"
              key="console"
              onClick={() => history.push("/client/login")}
            >
              返回登录
            </Button>,
            <Button key="buy" onClick={() => setVisible(false)}>
              关闭
            </Button>,
          ]}
        />
      </Modal>
      <ValidCodeModal
        modalVisible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOK={handleCaptcha}
      />
    </>
  );
};

export default Register;
