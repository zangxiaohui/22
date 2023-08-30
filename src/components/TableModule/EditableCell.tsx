import { Avatar, Form, Tooltip } from "antd";
import React, { ReactNode, isValidElement } from "react";
import { Rule } from "rc-field-form/lib/interface";
import styles from "./index.module.scss";

type renderFC = (record: any) => React.ReactNode
export interface CellNodeType {
  render: React.ReactNode | renderFC;
  rules?: Rule[];
}

export interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  cellNode: CellNodeType;
  children: React.ReactNode;
  record: any;
}

export const EditableCell: React.FC<EditableCellProps> = (props) => {
  const { editing, dataIndex, cellNode, children, title, record, ...restProps } = props;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          className={styles.formItem}
          validateFirst
          rules={cellNode.rules || []}
        >
          {
            cellNode?.render ? (isValidElement(cellNode.render) ? cellNode.render : (cellNode.render as renderFC)(record)) : cellNode.render
          }
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

interface EllipsisSpanProps {
  value?: string | ReactNode;
  className?: string;
  avatar?: string;
}

export const EllipsisSpan: React.FC<EllipsisSpanProps> = ({
                                                            value,
                                                            className = "",
                                                            avatar,
                                                          }) => {
  return (
    <>
      {avatar && <Avatar size={29} src={avatar} className={styles.avatar} />}
      {value ? (
        <Tooltip
          overlayClassName={styles.tooltip}
          placement={"topLeft"}
          title={value}
        >
          <span className={className}>{value}</span>
        </Tooltip>
      ) : (
        <span className={styles.empty}>--</span>
      )}
    </>
  );
};
