import { Button, Checkbox, Form, Input, Modal } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import lock from "../../assets/images/lock.svg";
import user from "../../assets/images/user.svg";
import { useLoginSMSToken } from "../../components/SendSMSToken";
import { LoginParams, getToken, login } from "../../services/login";
import styles from "./index.module.scss";

const { useForm } = Form;

const rememberUserNamekey = "cas-login:rememberUserName";
const userNameKey = "cas-login:username";

const commonPhoneRegex = /^(?:1\d{10}|0\d{2,3}-?\d{7,8})$/;

interface CodeParams {
  cellphone: string;
  code: string;
}

const serverPath = "http://baichuanpm.test.wxliebao.com";

const Login: React.FC = () => {
  const [form] = useForm();
  const [formCode] = useForm();
  const [userName, setUserName] = useState<string>("");
  const [captchaSrc, setCaptchaSrc] = useState<string>("");
  const [uid, setUid] = useState<string>("");
  const [remeber, setRemeber] = useState<boolean>(false);

  const [err, setErr] = useState<string>("");
  // const history = useHistory();

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
    // form.setFieldsValue({
    //   username: userName,
    // });
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

  const onPassFinish = (values: LoginParams) => {
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
    }).catch((e) => {
      errorHandler(e);
    });
  };

  return (
    <Form
      form={form}
      onFinish={onPassFinish}
      initialValues={{
        username: "BC230001-001",
        pwd: "123456",
      }}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: "用户名不能为空" }]}
      >
        <Input
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
          placeholder="请填写登录密码"
          size="large"
          prefix={<img src={lock} className="basic-form-prefix-icon" alt="" />}
        />
      </Form.Item>

      <Form.Item
        name="ValidCode"
        rules={[{ required: true, message: "验证码不能为空" }]}
      >
        <Input
          placeholder="请填写右侧验证码"
          size="large"
          style={{ width: 290 }}
          prefix={<img src={lock} className="basic-form-prefix-icon" alt="" />}
        />
      </Form.Item>
      <img
        src={captchaSrc}
        alt="验证码"
        onClick={refreshCaptcha}
        className={styles.captchaImg}
      />
      <div className={styles.checkboxWrapper}>
        <Checkbox
          checked={remeber}
          onChange={(e) => {
            setRemeber(e.target.checked);
          }}
        >
          记住账号
        </Checkbox>
        <Link to="/forgot-password?back=true">忘记密码？</Link>
      </div>
      <Form.Item>
        <Button
          htmlType="submit"
          className={styles.button}
          type="primary"
          size="large"
          block
        >
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
