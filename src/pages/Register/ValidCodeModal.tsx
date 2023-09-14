import { Button, Col, Form, Input, Modal, Row } from "antd";
import React, { useEffect } from "react";
import { useCaptcha } from "../../components/SendSMSToken/useCaptcha";

type ValidCodeModalProps = {
  modalVisible: boolean;
  onCancel: () => void;
  onOK: (values: any) => void;
};

const ValidCodeModal: React.FC<ValidCodeModalProps> = (props) => {
  const { modalVisible, onCancel, onOK } = props;
  const { captchaSrc, uid, refreshCaptcha } = useCaptcha();
  const [form] = Form.useForm();

  useEffect(() => {
    if (modalVisible) {
      form.resetFields();
      refreshCaptcha();
    }
  }, [modalVisible, form, refreshCaptcha]);

  const onFinish = async (values: any) => {
    onOK({
      uid,
      ValidCode: values?.ValidCode,
    });
  };

  return (
    <Modal
      width={480}
      footer={null}
      title="安全验证"
      open={modalVisible}
      onCancel={onCancel}
    >
      <div style={{ padding: "40px 20px" }}>
        <Form form={form} onFinish={onFinish}>
          <Form.Item>
            <Row gutter={20}>
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
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <img
                  src={captchaSrc}
                  style={{ cursor: "pointer" }}
                  alt="验证码"
                  onClick={() => {
                    refreshCaptcha();
                    form.setFieldsValue({
                      ValidCode: undefined,
                    });
                  }}
                />
              </Col>
            </Row>
          </Form.Item>
          <div style={{ textAlign: "center", margin: "30px 0 0" }}>
            <Button
              htmlType="submit"
              type="primary"
              size="large"
              style={{ width: "100px" }}
            >
              确 定
            </Button>
            <Button
              type="default"
              size="large"
              style={{ marginLeft: "20px", width: "100px" }}
              onClick={onCancel}
            >
              取消
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default ValidCodeModal;
