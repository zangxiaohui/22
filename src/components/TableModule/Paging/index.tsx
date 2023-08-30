import React, {useState} from "react";
import {Pagination} from "antd";
import classNames from "classnames";
import styles from "./index.module.scss"

export interface UsePagingResult {
  pageSize: number;
  current: number;
  setCurrent: (val: number) => void;
  totalCount?: number;
  setTotalCount: (count?: number) => void;
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
    current,
    setCurrent,
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
  showSizeChanger?: boolean;
  hideOnSinglePage?: boolean;
}

export const Paging: React.FC<PagingProps> = props => {
  const {current, pageSize, totalCount, antDPaginationOnChange, antDPaginationOnShowSizeChange} = props.pagingInfo;
  const {showSizeChanger = true, hideOnSinglePage} = props;

  return totalCount ? (
    <div className={classNames(styles.pagination, props.className)}>
      <div className={styles.total}>共{totalCount}条</div>
      <Pagination
        hideOnSinglePage={hideOnSinglePage}
        showSizeChanger={showSizeChanger}
        onShowSizeChange={antDPaginationOnShowSizeChange}
        current={current}
        onChange={antDPaginationOnChange}
        pageSize={pageSize}
        total={totalCount}
      />
    </div>
  ) : null;
}
