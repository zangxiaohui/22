import qs from "qs";
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

/** 服务电话 */
export function getTelInfo(): Promise<any> {
  return fetch(`/CusApi/ComData/infofwdh`, {
    method: "POST",
  });
}

export interface UserForm {
  RealName?: string;
  Email?: string;
  Address?: string;
}

/** 设置当前用户信息 */
export function updateCurrentUser(form: UserForm): Promise<any> {
  return fetch(`/CusApi/ComData/setuserinfo`, {
    method: "POST",
    body: qs.stringify({
      ...form,
    }),
  });
}

/** 修改密码 */
export function updatePwd(form: any): Promise<any> {
  return fetch(`/CusApi/ComData/changepd`, {
    method: "POST",
    body: qs.stringify({
      ...form,
    }),
  });
}
