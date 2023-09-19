import { Button, Card, Col, Form, Input, Modal, Row, message } from "antd";
import React, { useEffect, useState } from "react";
import PageContainer from "../../components/PageContainer";
import { useCurrentCompany, useSelf } from "../../layouts/RouteContext";
import { useBeforeUnload } from "../../lib/hooks";
import { updateCurrentUser } from "../../services/user";
import ModifyPassword from "../ModifyPassword";
import "./index.less";

const { useForm } = Form;

export const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
export const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const EditProfile: React.FC = () => {
  const [modified, setModified] = useState(false);

  const currentUser = useSelf();
  const currentCompany = useCurrentCompany();

  const [form] = useForm();

  useBeforeUnload(modified);

  const onFinish = async (values: any) => {
    const res = await updateCurrentUser(values);
    if (res?.state) {
      setModified(false);
      message.success("修改成功");
      window.location.reload();
    } else {
      Modal.error({
        title: res?.msg,
        okText: "关闭",
        width: 440,
      });
    }
  };

  useEffect(() => {
    if (currentUser && currentCompany) {
      form.setFieldsValue({
        Name: currentUser.Name,
        RealName: currentUser.RealName,
        Phone: currentUser.Phone,
        Email: currentUser.Email,
        Address: currentUser.Address,
        Con: currentCompany.Name,
      });
    }
  }, [currentUser, currentCompany, form]);

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
    <PageContainer routes={routes} className="profile-page">
      <div className="profile-mod">
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <Card title="信息管理" className="profile-card" bordered={false}>
              <Form
                form={form}
                onFinish={onFinish}
                onValuesChange={() => setModified(true)}
              >
                <Form.Item
                  label="个人编号"
                  name="Name"
                  rules={[{ required: true, message: "个人编号不能为空" }]}
                >
                  <Input
                    placeholder="请输入"
                    autoComplete="name"
                    disabled
                    allowClear
                    size="large"
                  />
                </Form.Item>
                <Form.Item
                  label="姓名"
                  name="RealName"
                  rules={[{ required: true, message: "姓名不能为空" }]}
                >
                  <Input placeholder="请输入" allowClear size="large" />
                </Form.Item>
                <Form.Item
                  label="公司"
                  name="Con"
                  rules={[{ required: true, message: "公司不能为空" }]}
                >
                  <Input
                    placeholder="请输入"
                    disabled
                    allowClear
                    size="large"
                  />
                </Form.Item>
                <Form.Item
                  label="电话"
                  name="Phone"
                  rules={[{ required: true, message: "电话不能为空" }]}
                >
                  <Input
                    placeholder="请输入"
                    disabled
                    allowClear
                    size="large"
                  />
                </Form.Item>
                <Form.Item label="邮箱" name="Email">
                  <Input placeholder="请输入" allowClear size="large" />
                </Form.Item>
                <Form.Item label="地址" name="Address">
                  <Input placeholder="请输入" allowClear size="large" />
                </Form.Item>
                <Form.Item className="btn-area">
                  <Button htmlType="submit" type="primary" block size="large">
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
            </Card>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <Card title="密码管理" className="profile-card" bordered={false}>
              <ModifyPassword />
            </Card>
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};

export default EditProfile;
