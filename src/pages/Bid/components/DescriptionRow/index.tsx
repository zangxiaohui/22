import classNames from "classnames";
import React from "react";
import { BidType, BidTypeColor } from "../../../../services/bid";
import "./index.less";

interface DescriptionRowProps {
  status: BidType;
  label: string;
  desc?: string;
  prefix?: string;
  className?: string;
}

const DescriptionRow: React.FC<DescriptionRowProps> = (props) => {
  const { label, desc, status, prefix } = props;

  return (
    <div className={classNames(props.className, "bid-description-row")}>
      <span className="label">{label}</span>
      <span className={`desc desc-${BidTypeColor[status]}`}>
        {prefix && <span className="prefix">{prefix}</span>}
        <span className="cont"> {desc ?? "--"}</span>
      </span>
    </div>
  );
};

export default DescriptionRow;
