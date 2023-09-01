import { Button, Divider, Form, Input } from "antd";
import React, { useState } from "react";
import FullPageWrapper from "../../components/FullPageWrapper";
import { useAsync, useBeforeUnload, useSubmission } from "../../lib/hooks";
import {
  forwardOrRefreshByQueryParam,
  redirectByQueryParam,
} from "../../lib/util";
import { getCurrentUserInfo, updateCurrentUser } from "../../services/login";
import styles from "./index.module.scss";

const { useForm } = Form;

const EditProfile: React.FC = () => {
  const [modified, setModified] = useState(false);

  const user = useAsync(getCurrentUserInfo);
  const [form] = useForm();
  const [doSubmit, submitting] = useSubmission();

  useBeforeUnload(modified);

  const onSubmit = () =>
    doSubmit(async () => {
      await updateCurrentUser(
        form.getFieldValue("name").trim(),
        form.getFieldValue("cellphone").trim()
      );
      setModified(false);
      await redirectByQueryParam(
        "redirect",
        "保存成功，正在跳转回原页面",
        "保存成功",
        3000
      );
    });

  const onCancel = () => {
    forwardOrRefreshByQueryParam("redirect");
  };

  return (
    <FullPageWrapper>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>编辑人员</h1>
        <Divider />
        {user && (
          <Form
            layout="vertical"
            form={form}
            onFinish={onSubmit}
            onValuesChange={() => setModified(true)}
            initialValues={{
              name: user.name,
              cellphone: user.cellphone,
            }}
          >
            <div className={styles.formWrapper}>
              <Form.Item required label="账号">
                <Input disabled value={user.username} />
              </Form.Item>
              <Form.Item
                label="人员姓名"
                name="name"
                rules={[
                  { required: true, message: "人员姓名不能为空" },
                  { whitespace: true, message: "人员姓名不能为空字符" },
                  { max: 50, message: "人员姓名不能超过50个字符" },
                ]}
              >
                <Input placeholder="请输入联系人名称" autoComplete="name" />
              </Form.Item>
              <Form.Item
                label="手机号码"
                name="cellphone"
                rules={[
                  { required: true, message: "手机号码不能为空" },
                  { pattern: /^\d{0,11}$/, message: "手机号码格式不正确" },
                ]}
              >
                <Input placeholder="请输入联系人电话" autoComplete="tel" />
              </Form.Item>
            </div>
            <Divider />
            <div className={styles.formWrapper}>
              <Button
                htmlType="submit"
                type="primary"
                loading={submitting}
                disabled={submitting}
              >
                保存
              </Button>
              &emsp;
              <Button onClick={onCancel}>取消</Button>
            </div>
          </Form>
        )}
      </div>
    </FullPageWrapper>
  );
};

export default EditProfile;
