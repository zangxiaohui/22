import { Button, Space, Table, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Paging, usePaging } from "../../../components";
import PageContainer from "../../../components/PageContainer";
import { useIsMobile, useSelf } from "../../../layouts/RouteContext";
import { getDeliveryList } from "../../../services/bid";
import { columns } from "./columns";
import "./index.less";

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
  {
    breadcrumbName: "提货记录",
  },
];

const tabItems: any[] = [
  {
    label: "提货记录",
    key: "item-1",
  },
];

const DeliveryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isMobile = useIsMobile();
  const history = useHistory();
  const currentUser = useSelf();
  const pagingInfo = usePaging();
  const { pageOffset, pageSize, setTotalCount } = pagingInfo;

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>();

  useEffect(() => {
    setLoading(true);
    getDeliveryList({
      page: pageOffset,
      pagesize: pageSize,
      Id: Number(id),
    })
      .then((res) => {
        if (res.state) {
          setData(res.data);
          setTotalCount(res?.total);
        }
      })
      .finally(() => setLoading(false));
  }, [id, pageSize, pageOffset, setTotalCount]);

  const telDom = <span className="h">{currentUser?.serviceTel}</span>;

  return (
    <PageContainer routes={routes} loading={loading}>
      <Tabs
        activeKey="item-1"
        type="card"
        items={tabItems}
        tabBarExtraContent={
          <Space size={40}>
            <Button onClick={() => history.goBack()}>返回 我的招标列表</Button>
            {!isMobile && telDom}
          </Space>
        }
      />
      {isMobile && (
        <div style={{ marginBottom: "10px", textAlign: "right" }}>{telDom}</div>
      )}
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey={(record) => record.CusLxr_Id}
        loading={loading}
      />
      <Paging pagingInfo={pagingInfo} />
    </PageContainer>
  );
};

export default DeliveryDetail;
