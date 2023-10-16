import { Button, List, Table, Tabs } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../../components/PageContainer";
import { Paging, usePaging } from "../../components/Paging";
import { useIsMobile, useSelf } from "../../layouts/RouteContext";
import { BidType, getMyBidList } from "../../services/bid";
import DeliveryForm from "./DeliveryForm";
import { columns, renderPrice, renderStatus, renderTitle } from "./columns";
import "./index.less";

interface MyBidProps {}

const tabItems: any[] = [
  {
    label: "正在进行中",
    key: BidType.PROCESSING,
  },
  {
    label: "已中标",
    key: BidType.SUCCESS,
  },
  {
    label: "全部记录",
    key: BidType.ALL,
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
  const isMobile = useIsMobile();
  const [tabActiveKey, setTabActiveKey] = useState<BidType>(BidType.PROCESSING);
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

  const renderBidAction = (item: any = {}) =>
    item.State === BidType.PROCESSING && (
      <Link to={`/client/bid/detail/${item.Propm_Id}`}>
        <Button
          type="primary"
          className="btn-red"
          size={isMobile ? "large" : "middle"}
        >
          立即出价
        </Button>
      </Link>
    );

  const renderDeliveryAction = (item: any = {}) =>
    item.State === BidType.SUCCESS && (
      <>
        <Button
          type="primary"
          size={isMobile ? "large" : "middle"}
          onClick={() => {
            setVisible(true);
            setFormData({
              productTitle: item.Propm_Title,
              productCount: item.Propm_Count,
              productCountUnit: item.Propm_Uint,
              id: item.Propm_Id,
            });
          }}
        >
          申请提货
        </Button>
        <div className="delivery-link">
          <Link to={`/client/account/my-bid/delivery/${item.Propm_Id}`}>
            提货记录
          </Link>
        </div>
      </>
    );

  const mergedColumns: ColumnsType<any> = [
    ...columns,
    {
      title: "操作",
      key: "action",
      width: 200,
      render: (_, record) => (
        <div className="my-bid-action">
          {renderBidAction(record)}
          {renderDeliveryAction(record)}
        </div>
      ),
    },
  ];

  const telDom = <div className="h">{currentUser?.serviceTel}</div>;

  return (
    <PageContainer routes={routes} className="company">
      <Tabs
        activeKey={tabActiveKey as any}
        onChange={onTabChange}
        type="card"
        items={tabItems}
        tabBarExtraContent={!isMobile && telDom}
      />
      <div>
        {isMobile && <div style={{ marginBottom: "10px" }}>{telDom}</div>}
        {isMobile ? (
          <List
            className="my-bid-list"
            loading={loading}
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item) => (
              <List.Item key={item.title}>
                <List.Item.Meta
                  title={
                    <div className="my-bid-title">{renderTitle(item)}</div>
                  }
                  description={
                    <div className="content">
                      {renderStatus(item)}
                      {renderPrice(item, true)}
                      <div className="op-wrap">
                        {renderBidAction(item)}
                        {renderDeliveryAction(item)}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Table
            columns={mergedColumns}
            dataSource={data}
            pagination={false}
            rowKey={(record) => record.Propm_Id}
            loading={loading}
          />
        )}

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
