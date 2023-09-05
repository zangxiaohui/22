import { fetch } from "../lib/fetch";

/** 获取当前用户信息 */
export function getSelf(): Promise<any> {
  return fetch(`/CusApi/ComData/getuserinfo`, {
    method: "POST",
  });
}
