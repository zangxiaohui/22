import { Button, Popconfirm, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { getContactList } from "../../../services/company";
import { columns } from "./columns";
import "./index.less";

const Contact: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>();

  useEffect(() => {
    setLoading(true);
    getContactList({
      page: 1,
      pagesize: 10,
    }).then((res) => {
      if (res.state) {
        setData(res.data);
      }
      setLoading(false);
    });
  }, []);

  const handleReview = () => {};

  const mergedColumns: ColumnsType<any> = [
    ...columns,
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            placement="topRight"
            title="确认审核通过吗?"
            onConfirm={() => handleReview(record.id)}
          >
            <span>审核通过</span>
          </Popconfirm>

          <Button type="link" onClick={handleReview}>
            审核通过
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <div className="contact">
      <Table
        columns={mergedColumns}
        dataSource={data}
        pagination={false}
        rowKey={(record) => record.invitation_id}
        loading={loading}
      />
    </div>
  );
};

export default Contact;
