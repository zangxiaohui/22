import { fetch } from "../lib/fetch";

/** 招标须知信息 */
export function getNoticeInfo(): Promise<any> {
  return fetch(`/CusApi/ComData/infozbxz`, {
    method: "POST",
  });
}
