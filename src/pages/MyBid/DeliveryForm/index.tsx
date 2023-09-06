import { Button, Col, Form, Input, Modal, Row, message } from "antd";
import layout from "antd/lib/layout";
import React from "react";
import { postDelivery } from "../../../services/bid";
import "./index.less";

type DeliveryFormProps = {
  modalVisible: boolean;
  onCancel: () => void;
  formData?: any;
};

const DeliveryForm: React.FC<DeliveryFormProps> = (props) => {
  const { modalVisible, onCancel, formData } = props;
  const [form] = Form.useForm();

  const onFinish = async () => {
    const values = form.getFieldsValue();
    const res = await postDelivery({
      Id: formData?.id,
      ...values,
    });
    if (res?.state) {
      message.success("操作成功");
    } else {
      Modal.error({
        title: res?.msg,
        okText: "关闭",
        width: 440,
      });
    }
  };

  return (
    <Modal
      wrapClassName="delivery-modal-wrap"
      width={900}
      destroyOnClose
      closable={false}
      title={
        <div className="modal-title">
          <div>申请提货 </div>
          <div className="sub-modal-title">
            请填写以下信息，我们将尽快为您安排发货
          </div>
        </div>
      }
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <div className="mod">
        <div className="mod-hd">产品名称：{formData?.productTitle}</div>
        <div className="mod-bd">
          <div className="mod-bd-title">提货信息</div>
          <div className="mod-form">
            <Form {...layout} form={form}>
              <Row gutter={60}>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <Form.Item label="提货时间" name="ThTime">
                    <Input placeholder="请输入" />
                  </Form.Item>
                  <Form.Item label="提货物料" name="Thwl">
                    <Input placeholder="请输入" />
                  </Form.Item>
                  <Form.Item label="车牌号" name="ThCarNo">
                    <Input placeholder="请输入" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <Form.Item label="司机姓名" name="Lxr">
                    <Input placeholder="请输入" />
                  </Form.Item>
                  <Form.Item label="联系方式" name="Phone">
                    <Input placeholder="请输入" />
                  </Form.Item>
                  <Form.Item label="起始地点" name="BAddress">
                    <Input placeholder="请输入" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        <div className="mod-ft">
          <Button
            type="primary"
            size="large"
            className="btn-red btn1"
            onClick={onFinish}
          >
            确认提货
          </Button>
          <Button size="large" className="btn2" onClick={onCancel}>
            先不提货
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeliveryForm;
