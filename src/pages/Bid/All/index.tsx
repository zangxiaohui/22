import React from "react";
import { BidType } from "../../../services/bid";
import BidList from "../components/List";

const AllBidList: React.FC = () => {
  return <BidList type={BidType.ALL} />;
};

export default AllBidList;
