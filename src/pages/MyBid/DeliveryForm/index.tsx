import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  message,
} from "antd";
import layout from "antd/lib/layout";
import classNames from "classnames";
import { isNil } from "lodash-es";
import moment from "moment";
import React from "react";
import { useIsMobile } from "../../../layouts/RouteContext";
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
  const isMobile = useIsMobile();

  const onFinish = async () => {
    form.validateFields().then(async (values: any) => {
      const { ThTime, ...rest } = values;
      const res = await postDelivery({
        Id: formData?.id,
        ThTime: ThTime ? moment(ThTime).format("YYYY-MM-DD HH:mm:ss") : null,
        ...rest,
      });
      if (res?.state) {
        message.success("操作成功");
        onCancel();
      } else {
        Modal.error({
          title: res?.msg,
          okText: "关闭",
          width: 440,
        });
      }
    });
  };

  const tipDom = (
    <div className="sub-modal-title">
      请填写以下信息，我们将尽快为您安排发货
    </div>
  );

  return (
    <Modal
      wrapClassName={classNames("delivery-modal-wrap", {
        isMobile: isMobile,
      })}
      width={900}
      destroyOnClose
      closable={false}
      title={
        <div className="modal-title">
          <div>申请提货 </div>
          {!isMobile && tipDom}
        </div>
      }
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      {isMobile && tipDom}
      <div className="mod">
        <div className="mod-hd">
          产品名称：
          <div>
            {formData?.productTitle}
            {!isNil(formData?.productCount) && <Divider type="vertical" />}
            <span>{formData?.productCount}</span>
          </div>
        </div>
        <div className="mod-bd">
          <div className="mod-bd-title">提货信息</div>
          <div className="mod-form">
            <Form {...layout} form={form}>
              <Row gutter={60}>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <Form.Item
                    label="提货时间"
                    name="ThTime"
                    rules={[{ required: true, message: "不能为空" }]}
                  >
                    <DatePicker
                      placeholder="请选择"
                      style={{ width: "100%" }}
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                    />
                  </Form.Item>
                  <Form.Item
                    label="提货物料"
                    name="Thwl"
                    rules={[{ required: true, message: "不能为空" }]}
                  >
                    <Input placeholder="请输入" />
                  </Form.Item>
                  <Form.Item
                    label="车牌号"
                    name="ThCarNo"
                    rules={[{ required: true, message: "不能为空" }]}
                  >
                    <Input placeholder="请输入" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <Form.Item
                    label="司机姓名"
                    name="Lxr"
                    rules={[{ required: true, message: "不能为空" }]}
                  >
                    <Input placeholder="请输入" />
                  </Form.Item>
                  <Form.Item
                    label="联系方式"
                    name="Phone"
                    rules={[{ required: true, message: "不能为空" }]}
                  >
                    <Input placeholder="请输入" />
                  </Form.Item>
                  <Form.Item
                    label="起始地点"
                    name="BAddress"
                    rules={[{ required: true, message: "不能为空" }]}
                  >
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
