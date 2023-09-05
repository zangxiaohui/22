import React from "react";
import { BidType } from "../../../services/bid";
import BidList from "../components/List";

const BidListInPreparation: React.FC = () => {
  return <BidList type={BidType.IN_PREPARATION} />;
};

export default BidListInPreparation;
