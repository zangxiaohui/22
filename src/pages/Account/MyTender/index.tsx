import React, { useState } from "react";
// import PageContainer from "../../../components/PageContainer";
// import { getMyTenderList } from "../../../services/tender";
import "./index.less";

interface MyTenderProps {}

const MyTender: React.FC<MyTenderProps> = (props) => {
  const [tabActiveKey, setTabActiveKey] = useState<any>();

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

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>();

  const items = [
    { label: "全部记录", key: "all" },
    { label: "正在进行中", key: "item-1" },
    { label: "已拍下", key: "item-2" },
  ];

  // useEffect(() => {
  //   setLoading(true);
  //   getMyTenderList({
  //     state: 0,
  //     pagesize: 10,
  //     page: 1,
  //   }).then((res) => {
  //     console.log("state :>> ", res);
  //     setLoading(false);
  //     setData(res?.data);
  //   });
  // }, []);

  const onTabChange = (key: string) => {
    setTabActiveKey(key);
    // history.push({
    //   query: {
    //     ...query,
    //     filter: key,
    //   },
    // });
  };

  return <div>111</div>;
};

export default MyTender;
