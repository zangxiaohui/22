import { Button, Form, Input, Popconfirm, Space, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useReducer, useState } from "react";
import AttachmentUpload from "../../../components/AttachmentUpload";
import {
  createCertification,
  deleteCertification,
  getCertificationList,
} from "../../../services/company";
import { columns } from "./columns";
import "./index.less";

const Certification: React.FC = () => {
  const [form] = Form.useForm();
  const [x, forceUpdate] = useReducer((x) => x + 1, 1);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>();

  useEffect(() => {
    setLoading(true);
    getCertificationList({
      page: 1,
      pagesize: 10,
    }).then((res) => {
      if (res.state) {
        setData(res.data);
      }
      setLoading(false);
    });
  }, [x]);

  const handleDelete = async (id: number) => {
    const res = await deleteCertification({ id });
    if (res.state) {
      message.success("删除成功");
      forceUpdate();
    }
  };

  const onValuesChange = async (changedValues: { [key: string]: any }) => {
    const { fileurl } = changedValues;
    const values = form.getFieldsValue();
    if (fileurl) {
      const res = await createCertification({
        filename: values?.filename,
        fileurl: fileurl?.[0]?.url,
      });
      if (res.state) {
        message.success("添加成功");
        form.resetFields();
        forceUpdate();
      }
    }
  };

  const mergedColumns: ColumnsType<any> = [
    ...columns,
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            placement="topRight"
            title="确认删除吗?"
            onConfirm={() => handleDelete(record.CusFile_Id)}
          >
            <Button danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="certification">
      <div className="certification-hd">
        <h2>新增其他资质</h2>
        <Form layout="inline" form={form} onValuesChange={onValuesChange}>
          <Form.Item label="资质名称" name="filename">
            <Input placeholder="请填写资质名称" size="large" />
          </Form.Item>
          <Form.Item
            name="fileurl"
            rules={[{ required: true, message: "不能为空" }]}
          >
            <AttachmentUpload
              maxSize={10}
              max={1}
              accept=".jpg,.jpeg,.png,.gif,.pdf"
            />
          </Form.Item>
        </Form>
      </div>
      <div className="certification-bd">
        <Table
          columns={mergedColumns}
          dataSource={data}
          pagination={false}
          rowKey={(record) => record.CusFile_Id}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Certification;
