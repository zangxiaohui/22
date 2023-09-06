import { Button, Popconfirm, Space, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useReducer, useState } from "react";
import { Paging, usePaging } from "../../../components";
import { getContactList, updateContact } from "../../../services/company";
import { ContactReviewType, columns } from "./columns";
import "./index.less";

const Contact: React.FC = () => {
  const [x, forceUpdate] = useReducer((x) => x + 1, 1);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>();

  const pagingInfo = usePaging();
  const { pageOffset, pageSize, setTotalCount } = pagingInfo;

  useEffect(() => {
    setLoading(true);

    getContactList({
      page: pageOffset,
      pagesize: pageSize,
    })
      .then((res) => {
        if (res.state) {
          setData(res.data);
          setTotalCount(res?.total);
        }
      })
      .finally(() => setLoading(false));
  }, [x, pageSize, pageOffset, setTotalCount]);

  const handleReview = async (id: number) => {
    const res = await updateContact({ id });
    if (res.state) {
      message.success("审核成功！");
      console.log("111 :>> ", 111);
      forceUpdate();
    } else {
      message.error(res?.msg);
    }
  };

  const mergedColumns: ColumnsType<any> = [
    ...columns,
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {record.CusLxr_State === ContactReviewType.UN_REVIEW && (
            <Popconfirm
              placement="topRight"
              title="确认审核通过?"
              onConfirm={() => handleReview(record.CusLxr_Id)}
            >
              <Button type="primary">审核通过</Button>
            </Popconfirm>
          )}
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
        rowKey={(record) => record.CusLxr_Id}
        loading={loading}
      />
      <Paging pagingInfo={pagingInfo} />
    </div>
  );
};

export default Contact;
