import React from "react";
import { BidType } from "../../../services/bid";
import BidList from "../components/List";

const BidListFinished: React.FC = () => {
  return <BidList type={BidType.FINISHED} />;
};

export default BidListFinished;
