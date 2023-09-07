import { Modal } from "antd";
import React from "react";

type BidConfirmModalProps = {
  visible: boolean;
  onCancel: () => void;
};

const BidConfirmModal: React.FC<BidConfirmModalProps> = (props) => {
  const { visible, onCancel } = props;

  return (
    <Modal
      wrapClassName="modal-wrap"
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
