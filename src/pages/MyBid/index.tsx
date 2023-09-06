import { Button, Popconfirm, Space, Table, Tabs } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useReducer, useState } from "react";
import PageContainer from "../../components/PageContainer";
import { useSelf } from "../../layouts/RouteContext";
import { BidType, getMyBidList } from "../../services/bid";
import { columns } from "./columns";
import "./index.less";

interface MyBidProps {}

const tabItems: any[] = [
  {
    label: "全部记录",
    key: BidType.ALL,
  },
  {
    label: "正在进行中",
    key: BidType.PROCESSING,
  },
  {
    label: "已拍下",
    key: BidType.SUCCESS,
  },
];

const routes = [
  {
    breadcrumbName: "首页",
  },
  {
    breadcrumbName: "我的",
  },
  {
    breadcrumbName: "我的招标",
  },
];

const MyBid: React.FC<MyBidProps> = (props) => {
  const currentUser = useSelf();
  const [x, forceUpdate] = useReducer((x) => x + 1, 1);
  const [tabActiveKey, setTabActiveKey] = useState<BidType>(BidType.ALL);

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>();

  useEffect(() => {
    setLoading(true);
    getMyBidList({
      state: tabActiveKey,
      pagesize: 10,
      page: 1,
    }).then((res) => {
      console.log("state :>> ", res);
      setLoading(false);
      setData(res?.data);
    });
  }, [x, tabActiveKey]);

  const handleDelete = async (id: number) => {};

  const onTabChange = (key: string) => {
    setTabActiveKey(key as any);
    // history.push({
    //   query: {
    //     ...query,
    //     filter: key,
    //   },
    // });
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
            onConfirm={() => handleDelete(record.Propm_Id)}
          >
            <Button danger>立即出价</Button>
          </Popconfirm>

          <Popconfirm
            placement="topRight"
            title="确认删除吗?"
            onConfirm={() => handleDelete(record.Propm_Id)}
          >
            <Button danger>申请提货</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer routes={routes} className="company">
      <Tabs
        activeKey={tabActiveKey as any}
        onChange={onTabChange}
        type="card"
        items={tabItems}
        tabBarExtraContent={<div className="h">{currentUser?.serviceTel}</div>}
      />
      <div>
        <Table
          columns={mergedColumns}
          dataSource={data}
          pagination={false}
          rowKey={(record) => record.Propm_Id}
          loading={loading}
        />
      </div>
    </PageContainer>
  );
};

export default MyBid;
