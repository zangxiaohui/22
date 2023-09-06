import { Button, Popconfirm, Space, Table, Tabs } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useReducer, useState } from "react";
import PageContainer from "../../components/PageContainer";
import { Paging, usePaging } from "../../components/Paging";
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

const MyBid: React.FC<MyBidProps> = () => {
  const currentUser = useSelf();
  const [x, forceUpdate] = useReducer((x) => x + 1, 1);
  const [tabActiveKey, setTabActiveKey] = useState<BidType>(BidType.ALL);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>();

  const pagingInfo = usePaging();
  const { pageOffset, pageSize, setTotalCount } = pagingInfo;

  useEffect(() => {
    setLoading(true);
    getMyBidList({
      state: tabActiveKey,
      pagesize: pageSize,
      page: pageOffset,
    })
      .then((res) => {
        if (res.state) {
          setData(res?.data);
          setTotalCount(res?.total);
        }
      })
      .finally(() => setLoading(false));
  }, [x, tabActiveKey, pageSize, pageOffset, setTotalCount]);

  const handleDelete = async (id: number) => {};

  const onTabChange = (key: string) => {
    setTabActiveKey(key as any);
  };

  const mergedColumns: ColumnsType<any> = [
    ...columns,
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {record.State === BidType.PROCESSING && (
            <Popconfirm
              placement="topRight"
              title="确认删除吗?"
              onConfirm={() => handleDelete(record.Propm_Id)}
            >
              <Button type="primary" className="btn-red">
                立即出价 222
              </Button>
            </Popconfirm>
          )}
          <Popconfirm
            placement="topRight"
            title="确认删除吗?"
            onConfirm={() => handleDelete(record.Propm_Id)}
          >
            <Button type="primary">申请提货</Button>
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
          scroll={{ x: "max-content" }}
        />
        <Paging pagingInfo={pagingInfo} />
      </div>
    </PageContainer>
  );
};

export default MyBid;
