import { fetch } from "../lib/fetch";

/** 获取当前用户信息 */
export function getSelf(): Promise<any> {
  return fetch(`/CusApi/ComData/getuserinfo`, {
    method: "POST",
  });
}

/** 获取当前用户公司信息 */
export function getCurrentCompany(): Promise<any> {
  return fetch(`/CusApi/ComData/getcompanyinfo`, {
    method: "POST",
  });
}

export interface UserForm {
  RealName?: string;
  Email?: string;
  Address?: string;
}

/** 设置当前用户信息 */
export function updateUser(form: UserForm): Promise<any> {
  return fetch(`/CusApi/ComData/setuserinfo`, {
    method: "POST",
  });
}
