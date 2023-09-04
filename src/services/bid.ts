import { fetch } from "../lib/fetch";

export enum AFSErrorCode {
  SUCCESS_1 = "100",
  SUCCESS_2 = "200",
  NEED_NC = "400",
  BLOCK_1 = "800",
  BLOCK_2 = "900",
}

const rawData = {
  state: true,
  msg: "",
  data: {
    openid:
      "03957C27A55F65974618ABCCD1C185291D0CA4EFE95A9DA300857F4F1DD60C7AB4DBB60B557723D2",
    curtoken: "3f1c812fc909769b6c8955f497b61701",
    username: "BC230001-001",
    userrealname: "张三",
    usercompany: "无锡猎豹信息科技有限公司",
    ismain: true,
    userstate: true,
    companystate: true,
  },
  total: 0,
  totalpage: 0,
  code: "0000",
};

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
