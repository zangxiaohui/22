import React from "react";
import { BidType } from "../../../services/bid";
import BidList from "../components/List";

const BidListTerminated: React.FC = () => {
  return <BidList type={BidType.TERMINATED} />;
};

export default BidListTerminated;
