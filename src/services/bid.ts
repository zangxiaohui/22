import qs from "qs";
import { fetch } from "../lib/fetch";
import { PagedRequest } from "./api";

export enum BidType {
  // 全部
  ALL = 0,
  // 即将开始
  IN_PREPARATION = 1,
  // 正在招标中
  PROCESSING = 2,
  // 已结束
  FINISHED = 3,
  // 已终止
  TERMINATED = 4,
  // 已中标
  SUCCESS = 5,
}

export const BidTypeLabel = {
  [BidType.ALL]: "全部产品",
  [BidType.IN_PREPARATION]: "即将开始",
  [BidType.PROCESSING]: "正在招标中",
  [BidType.FINISHED]: "已结束",
  [BidType.TERMINATED]: "已终止",
  [BidType.SUCCESS]: "已中标",
};

export const BidTypeColor = {
  [BidType.ALL]: "gray",
  [BidType.IN_PREPARATION]: "green",
  [BidType.PROCESSING]: "red",
  [BidType.FINISHED]: "gray",
  [BidType.TERMINATED]: "gray",
  [BidType.SUCCESS]: "blue",
};

export const BidTypeMap = {
  [BidType.ALL]: {
    label: "全部产品",
    color: "gray",
    badgeStatus: "default",
  },
  [BidType.IN_PREPARATION]: {
    label: "即将开始",
    color: "green",
    badgeStatus: "warning",
  },
  [BidType.PROCESSING]: {
    label: "正在招标中",
    color: "red",
    badgeStatus: "processing",
  },
  [BidType.FINISHED]: {
    label: "已结束",
    color: "gray",
    badgeStatus: "default",
  },
  [BidType.TERMINATED]: {
    label: "TERMINATED",
    color: "gray",
    badgeStatus: "default",
  },
  [BidType.SUCCESS]: {
    label: "已中标",
    color: "blue",
    badgeStatus: "success",
  },
};

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

interface GetBidHistoryRequest extends PagedRequest {
  Id: number;
}

/** 我司出价历史 */
export function getBidHistory(params: GetBidHistoryRequest): Promise<any> {
  return fetch(`/CusApi/ComData/zbjjprobjlist`, {
    method: "POST",
    body: qs.stringify({
      ...params,
    }),
  });
}

/** 竞价报价 */
export function postBid(params: {
  Id: number;
  price: number;
  num: number;
}): Promise<any> {
  return fetch(`/CusApi/ComData/zbjjprobj`, {
    method: "POST",
    body: qs.stringify({
      ...params,
    }),
  });
}

/** 竞价当前价格获取 */
export function getCurrentBidPrice(params: { Id: number }): Promise<any> {
  return fetch(`/CusApi/ComData/zbjjprocurprice`, {
    method: "POST",
    body: qs.stringify({
      ...params,
    }),
  });
}

/** 我的招标竞价列表 */
export function getMyBidList(params: any): Promise<any> {
  return fetch(`/CusApi/ComData/zbjjmylist`, {
    method: "POST",
    body: qs.stringify({
      ...params,
    }),
  });
}

interface GetDeliveryListRequest extends PagedRequest {
  Id: number;
}

/** 竞价提货列表 */
export function getDeliveryList(params: GetDeliveryListRequest): Promise<any> {
  return fetch(`/CusApi/ComData/zbjjmythjl`, {
    method: "POST",
    body: qs.stringify({
      ...params,
    }),
  });
}

/** 竞价提货列表 */
export function postDelivery(params: any): Promise<any> {
  return fetch(`/CusApi/ComData/zbjjmythjlsave`, {
    method: "POST",
    body: qs.stringify({
      ...params,
    }),
  });
}
