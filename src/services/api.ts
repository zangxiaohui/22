import { fetch } from "../lib/fetch";
export interface PagedRequest {
  pagesize?: number;
  page?: number;
}

/** 招标须知信息 */
export function getNoticeInfo(): Promise<any> {
  return fetch(`/CusApi/ComData/infozbxz`, {
    method: "POST",
  });
}

/** 联系信息 */
export function getContactInfo(): Promise<any> {
  return fetch(`/CusApi/ComData/infocontact`, {
    method: "POST",
  });
}

export function getProductCategory(): Promise<any> {
  return fetch(`/CusApi/ComData/xpcate`, {
    method: "POST",
  });
}
