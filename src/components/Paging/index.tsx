import { Pagination } from "antd";
import classNames from "classnames";
import React, { useState } from "react";
import styles from "./index.module.scss";

export interface UsePagingResult {
  pageSize: number;
  pageOffset: number;
  setPageOffset: (val: number) => void;
  totalCount?: number;
  setTotalCount: (count: number) => void;
  antDPaginationOnChange: (value: number) => void;
  antDPaginationOnShowSizeChange: (current: number, size: number) => void;
}

export function usePaging(size?: number): UsePagingResult {
  const [pageSize, setPageSize] = useState(size || 10);
  const [current, setCurrent] = useState(1);
  const [totalCount, setTotalCount] = useState<number>();

  return {
    pageSize,
    totalCount,
    setTotalCount,
    pageOffset: current,
    setPageOffset: setCurrent,
    antDPaginationOnChange: (value: number) => {
      setCurrent(value);
    },
    antDPaginationOnShowSizeChange: (current: number, size: number) => {
      setCurrent(1);
      setPageSize(size);
    },
  };
}

export interface PagingProps {
  className?: string;
  pagingInfo: UsePagingResult;
}

export const Paging: React.FC<PagingProps> = (props) => {
  const {
    pageOffset,
    pageSize,
    totalCount,
    antDPaginationOnChange,
    antDPaginationOnShowSizeChange,
  } = props.pagingInfo;

  return totalCount ? (
    <div className={classNames(styles.pagination, props.className)}>
      <div className={styles.total}>共{totalCount}条</div>
      <Pagination
        showSizeChanger
        onShowSizeChange={antDPaginationOnShowSizeChange}
        current={pageOffset}
        onChange={antDPaginationOnChange}
        pageSize={pageSize}
        total={totalCount}
        pageSizeOptions={["5", "10", "20", "30", "50", "100"]}
      />
    </div>
  ) : null;
};
