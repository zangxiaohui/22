import React, {useState} from "react";
import {Pagination} from "antd";

export interface UsePagingResult {
    pageSize: number;
    pageOffset: number;
    setPageOffset: (val: number) => void;
    totalCount?: number;
    setTotalCount: (count: number) => void;
    antdPaginationOnChange: (value: number) => void;
    antdPaginationOnShowSizeChange: (current: number, size: number) => void;
}


export function usePaging(): UsePagingResult {
    const [pageSize, setPageSize] = useState(20);
    const [pageOffset, setPageOffset] = useState(0);
    const [totalCount, setTotalCount] = useState<number>();

    return {
        pageSize,
        pageOffset,
        totalCount,
        setTotalCount,
        setPageOffset,
        antdPaginationOnChange: (value: number) => {
            setPageOffset((value - 1) * pageSize);
        },
        antdPaginationOnShowSizeChange: (current: number, size: number) => {
            setPageOffset(0);
            setPageSize(size);
        },
    };
}

export interface PagingProps {
    className?: string;
    pagingInfo: UsePagingResult;
}

export const Paging: React.FC<PagingProps> = props => {
    const {pageOffset, pageSize, totalCount, antdPaginationOnChange, antdPaginationOnShowSizeChange} = props.pagingInfo;

    return totalCount ? (
        <div className={props.className}>
            <div className="total">共{totalCount}条</div>
            <Pagination
                showSizeChanger
                onShowSizeChange={antdPaginationOnShowSizeChange}
                current={Math.floor(pageOffset / pageSize) + 1}
                onChange={antdPaginationOnChange}
                pageSize={pageSize}
                total={totalCount}
            />
        </div>
    ) : null;
}
