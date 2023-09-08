import { Button, Checkbox, Col, Form, Input, Modal, Row } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import captcha from "../../assets/images/captcha.svg";
import lock from "../../assets/images/pwd2.svg";
import user from "../../assets/images/user2.svg";
import { useLoginSMSToken } from "../../components/SendSMSToken";
import { LoginParams, getToken, login } from "../../services/login";
import styles from "./index.module.scss";

const { useForm } = Form;

const rememberUserNamekey = "cas-login:rememberUserName";
const userNameKey = "cas-login:username";

export const serverPath = "http://baichuanpm.test.wxliebao.com:88";

interface CodeParams {
  cellphone: string;
  code: string;
}

const Login: React.FC = () => {
  const [form] = useForm();
  const [userName, setUserName] = useState<string>("");
  const [captchaSrc, setCaptchaSrc] = useState<string>("");
  const [uid, setUid] = useState<string>("");
  const [remeber, setRemeber] = useState<boolean>(false);

  const [err, setErr] = useState<string>("");
  const history = useHistory();

  const { canSendSMS, sendSMS, smsSending, smsCoolDown, setCellphone } =
    useLoginSMSToken();

  const refreshCaptcha = () => {
    getToken().then((res) => {
      const { token, uid } = res?.data;
      setUid(uid);
      setCaptchaSrc(
        `${serverPath}/webdata/user/ValidCodeImageCus.aspx?uid=${uid}&token=${token}`
      );
    });
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  useEffect(() => {
    const rememberUserName = localStorage.getItem(rememberUserNamekey);
    if (rememberUserName === null) {
      setRemeber(true);
    } else if (rememberUserName === "true") {
      const userName = localStorage.getItem(userNameKey) || "";
      setUserName(userName);
      setRemeber(true);
    }
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      username: userName,
    });
  }, [form, userName]);

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

  const onFinish = (values: LoginParams) => {
    // window.location.replace("/dashboard");
    // setAuthority("admin");

    if (remeber) {
      localStorage.setItem(rememberUserNamekey, "true");
      localStorage.setItem(userNameKey, values.username);
    } else {
      localStorage.setItem(rememberUserNamekey, "false");
      localStorage.removeItem(userNameKey);
    }

    login({
      ...values,
      uid,
    })
      .then((res: any) => {
        if (res.state) {
          const { openid, curtoken, ismain, companystate, userstate } =
            res?.data || {};

          localStorage.setItem("baichuan_openid", openid);
          localStorage.setItem("baichuan_curtoken", curtoken);
          localStorage.setItem("baichuan_info", JSON.stringify(res?.data));

          if (ismain && !companystate && !userstate) {
            history.push("/client/account/manage-company");
          } else {
            history.push("/client/home");
          }
          // setAuthority("admin");
        } else {
          Modal.error({
            content: <div style={{ width: 250 }}>{res.msg}</div>,
            okText: "关闭",
          });
        }
      })
      .catch((e) => {
        errorHandler(e);
      });
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        name="username"
        rules={[{ required: true, message: "用户名不能为空" }]}
      >
        <Input
          allowClear
          placeholder="请填写用户名"
          size="large"
          prefix={<img src={user} className="basic-form-prefix-icon" alt="" />}
        />
      </Form.Item>
      <Form.Item
        name="pwd"
        rules={[{ required: true, message: "密码不能为空" }]}
      >
        <Input.Password
          allowClear
          placeholder="请填写登录密码"
          size="large"
          prefix={<img src={lock} className="basic-form-prefix-icon" alt="" />}
        />
      </Form.Item>
      <Form.Item>
        <Row gutter={8}>
          <Col span={16}>
            <Form.Item
              name="ValidCode"
              noStyle
              rules={[{ required: true, message: "验证码不能为空" }]}
            >
              <Input
                allowClear
                placeholder="请填写右侧验证码"
                size="large"
                prefix={
                  <img
                    src={captcha}
                    className="basic-form-prefix-icon"
                    alt=""
                  />
                }
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <img
              src={captchaSrc}
              alt="验证码"
              onClick={refreshCaptcha}
              className={styles.captchaImg}
            />
          </Col>
        </Row>
      </Form.Item>
      <div className={styles.checkboxWrapper}>
        <Checkbox
          checked={remeber}
          onChange={(e) => {
            setRemeber(e.target.checked);
          }}
        >
          记住账号
        </Checkbox>
        <Link to="/client/forgot-password">忘记密码？</Link>
      </div>

      <Row gutter={10} className={styles.btnArea}>
        <Col span={8}>
          <Button
            htmlType="submit"
            className={styles.button}
            type="primary"
            size="large"
            block
          >
            登 录
          </Button>
        </Col>
        <Col span={8}>
          <Button
            className={styles.button}
            type="primary"
            size="large"
            block
            onClick={() => {
              form.resetFields();
            }}
          >
            重 置
          </Button>
        </Col>
        <Col span={8}>
          <Button
            className={styles.button}
            type="primary"
            size="large"
            block
            onClick={() => {
              history.push("/client/register");
            }}
          >
            注 册
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default Login;
