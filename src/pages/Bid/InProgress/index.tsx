import React from "react";
import { BidType } from "../../../services/bid";
import BidList from "../components/List";

const BidListInProgress: React.FC = () => {
  return <BidList type={BidType.PROCESSING} />;
};

export default BidListInProgress;
