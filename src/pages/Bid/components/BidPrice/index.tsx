import { Statistic } from "antd";
import React from "react";

interface BidPriceProps {
  priceValue: number;
}

export const BidPrice: React.FC<BidPriceProps> = ({ priceValue }) => (
  <Statistic value={priceValue} prefix="¥" />
);

const BidPrice2: React.FC<BidPriceProps> = ({ priceValue }) => (
  <Statistic value={priceValue} prefix="¥" />
);
