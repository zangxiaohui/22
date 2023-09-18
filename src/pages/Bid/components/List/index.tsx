import { Button, Card, Divider, List } from "antd";
import { isNil } from "lodash-es";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Paging, usePaging } from "../../../../components";
import PageContainer from "../../../../components/PageContainer";
import {
  BidType,
  BidTypeColor,
  BidTypeLabel,
  getBidList,
} from "../../../../services/bid";
import Row from "../DescriptionRow";
import "./index.less";

interface BidListProps {
  type: BidType;
}

const BidList: React.FC<BidListProps> = (props) => {
  const { type } = props;
  const routes = [
    {
      breadcrumbName: "首页",
    },
    {
      breadcrumbName: "招标的产品",
    },
    {
      breadcrumbName: BidTypeLabel[type],
    },
  ];

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>();

  const pagingInfo = usePaging();
  const { pageOffset, pageSize, setTotalCount } = pagingInfo;

  useEffect(() => {
    setLoading(true);
    getBidList({
      state: type,
      pagesize: pageSize,
      page: pageOffset,
    })
      .then((res) => {
        setData(res?.data);
        setTotalCount(res?.total);
      })
      .finally(() => setLoading(false));
  }, [type, pageSize, pageOffset, setTotalCount]);

  return (
    <PageContainer routes={routes} className="bid">
      <List
        loading={loading}
        grid={{
          gutter: 18,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Link to={`/client/bid/detail/${item?.Propm_Id}`}>
              <Card
                title={
                  <div>
                    {item?.Propm_Title}
                    {!isNil(item?.Propm_Count) && <Divider type="vertical" />}
                    <span>{item?.Propm_Count}</span>
                  </div>
                }
                className="bid-card"
                hoverable
                bordered={false}
              >
                <div>
                  {(item?.State === BidType.PROCESSING ||
                    item?.State === BidType.FINISHED ||
                    item?.State === BidType.TERMINATED) && (
                    <Row
                      status={item?.State}
                      label={
                        item?.State === BidType.FINISHED ? "成交价" : "当前价"
                      }
                      prefix="¥"
                      desc={item?.Propm_CurPrice}
                      className="font-size-lg colorful"
                    />
                  )}
                  <Row
                    status={item?.State}
                    label="起拍价"
                    prefix="¥"
                    desc={item?.Propm_StartPrice}
                    className={
                      item?.State === BidType.IN_PREPARATION
                        ? "font-size-lg colorful"
                        : ""
                    }
                  />

                  <Row
                    status={item?.State}
                    label="结&nbsp;&nbsp;&nbsp;&nbsp;束"
                    desc={
                      item?.Propm_EndTime
                        ? moment(item?.Propm_EndTime).format(
                            "YYYY-MM-DD HH:mm:ss"
                          )
                        : undefined
                    }
                  />

                  <Row
                    status={item?.State}
                    label="备&nbsp;&nbsp;&nbsp;&nbsp;注"
                    desc={item?.Propm_Remark}
                  />
                </div>
                <div className="bid-action">
                  <Button
                    type="primary"
                    block
                    className={`btn-${BidTypeColor[item?.State as BidType]}`}
                  >
                    {item?.StateName ?? "--"}
                  </Button>
                  <Button type="primary" block>
                    参加人数 {item?.Cyrs ?? 0}
                  </Button>
                </div>
              </Card>
            </Link>
          </List.Item>
        )}
      />
      <Paging pagingInfo={pagingInfo} />
    </PageContainer>
  );
};

export default BidList;
