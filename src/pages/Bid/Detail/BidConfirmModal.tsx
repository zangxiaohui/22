import { Modal } from "antd";
import classNames from "classnames";
import React from "react";
import { useIsMobile } from "../../../layouts/RouteContext";

type BidConfirmModalProps = {
  visible: boolean;
  onCancel: () => void;
};

const BidConfirmModal: React.FC<BidConfirmModalProps> = (props) => {
  const { visible, onCancel } = props;
  const isMobile = useIsMobile();

  const className = classNames("modal-wrap", {
    isMobile: isMobile,
  });

  return (
    <Modal
      wrapClassName={className}
      width={692}
      destroyOnClose
      title="出价确认"
      open={visible}
      onCancel={() => onCancel()}
      footer={null}
    >
      {props.children}
    </Modal>
  );
};

export default BidConfirmModal;
