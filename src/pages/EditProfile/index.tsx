import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import PageContainer from "../../components/PageContainer";
import { useBeforeUnload, useSubmission } from "../../lib/hooks";
import {
  forwardOrRefreshByQueryParam,
  redirectByQueryParam,
} from "../../lib/util";
import { updateCurrentUser } from "../../services/login";
import styles from "./index.module.scss";

const { useForm } = Form;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const EditProfile: React.FC = () => {
  const [modified, setModified] = useState(false);
  // const user1 = useAsync(getCurrentUserInfo);

  const user = {
    Name: "BC230001-001",
    RealName: "张三",
    Phone: "18168871151",
    Email: "12524051@qq.com",
    Address: "江苏省无锡市中山路288号",
  };
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

  const routes = [
    {
      breadcrumbName: "首页",
    },
    {
      breadcrumbName: "我的",
    },
    {
      breadcrumbName: "个人信息管理",
    },
  ];

  return (
    <PageContainer routes={routes}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>信息管理</h1>

        <div className={styles.formWrapper}>
          {user && (
            <Form
              {...layout}
              form={form}
              onFinish={onSubmit}
              onValuesChange={() => setModified(true)}
              initialValues={user}
            >
              <Form.Item
                label="个人编号"
                name="Name"
                rules={[{ required: true, message: "个人编号不能为空" }]}
              >
                <Input placeholder="请输入" autoComplete="name" disabled />
              </Form.Item>
              <Form.Item
                label="姓名"
                name="RealName"
                rules={[{ required: true, message: "姓名不能为空" }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item
                label="公司"
                name="Con"
                rules={[{ required: true, message: "公司不能为空" }]}
              >
                <Input placeholder="请输入" disabled />
              </Form.Item>
              <Form.Item
                label="电话"
                name="Phone"
                rules={[{ required: true, message: "电话不能为空" }]}
              >
                <Input placeholder="请输入" disabled />
              </Form.Item>
              <Form.Item
                label="邮箱"
                name="Email"
                rules={[{ required: true, message: "邮箱不能为空" }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item
                label="地址"
                name="Address"
                rules={[{ required: true, message: "地址不能为空" }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Button
                  htmlType="submit"
                  type="primary"
                  loading={submitting}
                  disabled={submitting}
                  block
                >
                  修改
                </Button>
              </Form.Item>
              {/* <Form.Item
                label="手机号码"
                name="cellphone"
                rules={[
                  { required: true, message: "手机号码不能为空" },
                  { pattern: /^\d{0,11}$/, message: "手机号码格式不正确" },
                ]}
              >
                <Input placeholder="请输入联系人电话" autoComplete="tel" />
              </Form.Item> */}
            </Form>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default EditProfile;
