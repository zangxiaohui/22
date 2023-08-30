import React from "react";
import { Table as AntDTable } from "antd";
import { TableProps } from "antd/lib/table";
import styles from "./index.module.scss";

function Table<T extends object>(props: TableProps<T>) {
  const { bordered=true } = props;
  return (
    <AntDTable<T>
      {...props}
      tableLayout={'fixed'}
      bordered={bordered}
      className={styles.table}
      pagination={false}
    />
  )
}

export default Table;
