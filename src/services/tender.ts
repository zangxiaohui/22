import qs from "qs";
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

export const BidTypeLabel = {
  [BidType.ALL]: "全部产品",
  [BidType.IN_PREPARATION]: "即将开始",
  [BidType.IN_PROGRESS]: "正在招标中",
  [BidType.FINISHED]: "已结束",
  [BidType.TERMINATED]: "已终止",
};

export const BidTypeColor = {
  [BidType.ALL]: "gray",
  [BidType.IN_PREPARATION]: "green",
  [BidType.IN_PROGRESS]: "red",
  [BidType.FINISHED]: "gray",
  [BidType.TERMINATED]: "gray",
};

export interface PagedRequest {
  pagesize?: number;
  page?: number;
}

interface GetBidListRequest extends PagedRequest {
  state?: BidType;
}

/** 获取招标竞价列表 */
export function getBidList(params: GetBidListRequest): Promise<any> {
  return fetch(`/CusApi/ComData/zbjjlist`, {
    method: "POST",
    body: qs.stringify({
      ...params,
    }),
  });
}

/** 获取招标竞价产品详情 */
export function getBidDetail(params: { Id: number }): Promise<any> {
  return fetch(`/CusApi/ComData/zbjjprodetails`, {
    method: "POST",
    body: qs.stringify({
      ...params,
    }),
  });
}

/** 竞价当前价格获取 */
export function getBidCurrentPrice(params: { Id: number }): Promise<any> {
  return fetch(`/CusApi/ComData/zbjjprocurprice`, {
    method: "POST",
    body: qs.stringify({
      ...params,
    }),
  });
}

/** 我司出价历史 */
export function getBidHistory(params: { Id: number }): Promise<any> {
  return fetch(`/CusApi/ComData/zbjjprobjlist`, {
    method: "POST",
    body: qs.stringify({
      ...params,
    }),
  });
}

/** 竞价报价 */
export function postBid(params: { Id: number; price: number }): Promise<any> {
  return fetch(`/CusApi/ComData/zbjjprobj`, {
    method: "POST",
    body: qs.stringify({
      ...params,
    }),
  });
}

/** 我的招标竞价列表 */
export function getMyTenderList(params: any): Promise<any> {
  return fetch(`/CusApi/ComData/zbjjmylist`, {
    method: "POST",
    body: qs.stringify({
      ...params,
    }),
  });
}
