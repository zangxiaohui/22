import { Button, Popconfirm, Space, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import {
  deleteCertification,
  getCertificationList,
} from "../../../services/company";
import { columns } from "./columns";
import "./index.less";

const Certification: React.FC = () => {
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
  }, []);

  const handleDelete = async (id: string) => {
    const res = await deleteCertification({ id });
    if (res.state) {
      message.success("删除成功");
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
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="certification">
      <div className="certification-hd">新增其他资质</div>
      <div className="certification-bd">
        <Table
          columns={mergedColumns}
          dataSource={data}
          pagination={false}
          rowKey={(record) => record.invitation_id}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Certification;
