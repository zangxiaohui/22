import { fetch } from "../lib/fetch";

export enum AFSErrorCode {
  SUCCESS_1 = "100",
  SUCCESS_2 = "200",
  NEED_NC = "400",
  BLOCK_1 = "800",
  BLOCK_2 = "900",
}

export enum BidType {
  // 全部
  ALL = 0,
  // 即将开始
  IN_PREPARATION = 1,
  // 正在招标中
  IN_PROGRESS = 2,
  // 已结束
  FINISHED = 3,
  // 已终止
  TERMINATED = 4,
}

export interface PagedRequest {
  pagesize?: number;
  page?: number;
}

interface GetBidListRequest extends PagedRequest {
  state?: BidType;
}

/** 获取招标竞价列表 */
export function getBidList(query: GetBidListRequest): Promise<any> {
  return fetch(`/CusApi/ComData/zbjjlist`, {
    method: "POST",
    body: JSON.stringify(query),
  });
}

/** 获取招标竞价产品详情 */
export function getBidDetail(query: { Id: number }): Promise<any> {
  return fetch(`/CusApi/ComData/zbjjprodetails`, {
    method: "POST",
    body: JSON.stringify(query),
  });
}
