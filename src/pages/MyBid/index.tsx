import { Button, Popconfirm, Space, Table, Tabs } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../../components/PageContainer";
import { Paging, usePaging } from "../../components/Paging";
import { useSelf } from "../../layouts/RouteContext";
import { BidType, getMyBidList } from "../../services/bid";
import DeliveryForm from "./DeliveryForm";
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
  const [tabActiveKey, setTabActiveKey] = useState<BidType>(BidType.ALL);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>();

  const [visible, setVisible] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>();

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
  }, [tabActiveKey, pageSize, pageOffset, setTotalCount]);

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
        <div className="my-bid-action">
          <Space size="middle">
            {record.State === BidType.PROCESSING && (
              <Popconfirm
                placement="topRight"
                title="确认删除吗?"
                onConfirm={() => handleDelete(record.Propm_Id)}
              >
                <Button type="primary" className="btn-red">
                  立即出价
                </Button>
              </Popconfirm>
            )}

            {record.State !== BidType.PROCESSING && (
              <Button
                type="primary"
                onClick={() => {
                  setVisible(true);
                  setFormData({
                    productTitle: record.Propm_Title,
                    id: record.Propm_Id,
                  });
                }}
              >
                申请提货
              </Button>
            )}
          </Space>
          <div className="delivery-link">
            <Link to={`/client/account/my-bid/delivery/${record.Propm_Id}`}>
              提货记录
            </Link>
          </div>
        </div>
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
      <DeliveryForm
        formData={formData}
        modalVisible={visible}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </PageContainer>
  );
};

export default MyBid;
