import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  TreeSelect,
  message,
} from "antd";
import { DataNode } from "antd/lib/tree";
import { isEmpty } from "lodash-es";
import React, { useEffect, useMemo } from "react";
import AttachmentUpload from "../../../components/AttachmentUpload";
import PageLoading from "../../../components/PageLoading";
import { useCurrentCompany, useSelf } from "../../../layouts/RouteContext";
import { useAsync } from "../../../lib/hooks";
import { getTreeData, uploadFile } from "../../../services/company";
import "./index.less";

const { useForm } = Form;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

function buildProductTreeData(data: any[]): DataNode[] {
  if (!data) {
    return [];
  }
  if (!Array.isArray(data)) {
    data = [data];
  }
  return data.map((item) => {
    const res: DataNode = {
      ...item,
      title: item.name,
      key: item.value,
      children: buildProductTreeData(item.children),
    };
    return res;
  });
}

const CompanyInfo: React.FC = () => {
  const [form] = useForm();
  const currentUser = useSelf();
  const currentCompany = useCurrentCompany();
  const initTreeData = useAsync(getTreeData);

  const treeData = useMemo(() => {
    if (initTreeData?.state) {
      return buildProductTreeData(initTreeData?.data);
    }
    return [];
  }, [initTreeData]);

  useEffect(() => {
    if (currentCompany) {
      form.setFieldsValue({
        ...currentCompany,
        XqCateIds: currentCompany.XqCateIds?.split(","),
      });
    }
  }, [currentCompany, form]);

  const onFinish = async (values: any) => {
    const { fileList } = values;

    const formData = new FormData();
    formData.append("filezjz", fileList?.[0] as unknown as Blob);
    const res = await uploadFile(formData);
    console.log("fileList :>> ", fileList);
    console.log("res1 :>> ", res);
    // const res = await updateCompany(values);
    if (res?.state) {
      message.success("修改成功");
    } else {
      Modal.error({
        title: res?.msg,
        okText: "关闭",
        width: 440,
      });
    }
  };

  if (isEmpty(currentCompany) || isEmpty(treeData)) {
    return <PageLoading />;
  }

  return (
    <div className="company-info">
      <div className="company-info-hd">
        <div>
          {currentUser?.RealName}您好，您是
          <span className="company-name">{currentCompany?.Name}</span>
          首位注册人
        </div>
        <div>
          在完善企业信息后，您将成为企业管理员。所有通过该企业名称注册的会员需由您审核后才能正常使用
        </div>
      </div>
      <div className="company-info-bd">
        <Form {...layout} form={form} onFinish={onFinish}>
          <Row gutter={16}>
            {/* <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <div className="company-info-title">企业基本信息</div>
              <Form.Item
                label="公司名称"
                name="Name"
                rules={[{ required: true, message: "不能为空" }]}
              >
                <Input placeholder="请输入" disabled />
              </Form.Item>
              <Form.Item
                label="法人代表"
                name="Frdb"
                rules={[{ required: true, message: "不能为空" }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item
                label="公司地址"
                name="Address"
                rules={[{ required: true, message: "不能为空" }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item
                label="注册资金"
                name="RealName"
                rules={[{ required: true, message: "不能为空" }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col> */}
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <div
                className="company-info-title"
                style={{ visibility: "hidden" }}
              >
                企业基本信息
              </div>
              <Form.Item
                label="营业执照"
                name="fileList"
                rules={[{ required: true, message: "不能为空" }]}
              >
                <AttachmentUpload maxSize={5} />
              </Form.Item>
              <Form.Item
                label="公司性质"
                name="Gsxz"
                rules={[{ required: true, message: "不能为空" }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item
                label="需求类别"
                name="XqCateIds"
                rules={[{ required: true, message: "不能为空" }]}
              >
                <TreeSelect
                  multiple
                  treeData={treeData}
                  placeholder="请选择"
                  listHeight={300}
                />
              </Form.Item>
            </Col>
            {/* <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <div className="company-info-title">企业开票信息</div>
              <Form.Item
                label="纳税人识别号"
                name="Nsrsbh"
                rules={[{ required: true, message: "不能为空" }]}
              >
                <Input placeholder="请输入" disabled />
              </Form.Item>
              <Form.Item
                label="开户行"
                name="BankName"
                rules={[{ required: true, message: "不能为空" }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item
                label="银行账号"
                name="BankNo"
                rules={[{ required: true, message: "不能为空" }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item
                label="电话"
                name="FpTel"
                rules={[{ required: true, message: "不能为空" }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col> */}
          </Row>

          <Form.Item style={{ textAlign: "center" }}>
            <Button htmlType="submit" type="primary" style={{ width: 258 }}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CompanyInfo;
