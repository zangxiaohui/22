import qs from "qs";
import { fetch } from "../lib/fetch";

export function sendRegisterSMSCode(request: any): Promise<any> {
  return fetch("/CusApi/ComData/getregsmscode", {
    method: "POST",
    body: qs.stringify({
      ...request,
    }),
  });
}

export function sendForgotSMSCode(request: any): Promise<any> {
  return fetch("/CusApi/ComData/getforgetsmscode", {
    method: "POST",
    body: qs.stringify({
      ...request,
    }),
  });
}

export interface ActivateResetPasswordRequest {
  code: string;
  oldPassword: string;
  cellphone: string;
  newPassword: string;
}

export function activateResetPassword(
  request: ActivateResetPasswordRequest
): Promise<void> {
  return fetch("/api/selfmgmt/resetpassword", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export interface TokenResponse {
  token: string;
}

export function getVerifyCellphoneToken(
  cellphone: string,
  code: string
): Promise<TokenResponse> {
  return fetch("/api/selfmgmt/verifytoken", {
    method: "POST",
    body: JSON.stringify({
      code,
      cellphone,
    }),
  });
}

export interface forgotResetPasswordRequest {
  phone: string;
  pwd: string;
  UserName: string;
  SMSCode: string;
}

export function forgotResetPassword(
  request: forgotResetPasswordRequest
): Promise<any> {
  return fetch("/CusApi/ComData/userforgetpdg", {
    method: "POST",
    body: qs.stringify({
      ...request,
    }),
  });
}

interface WXIdentity {
  avatarUrl: string;
  city: string;
  country: string;
  gender?: string;
  language: string;
  nickname: string;
  province: string;
}

export interface User {
  muid: string;
  name: string;
  username: string;
  cellphone: string;
  expired: boolean;
  disabled: boolean;
  weixinIdentity: WXIdentity | null;
}

export function getCurrentUserInfo(): Promise<User> {
  return fetch(`/api/selfmgmt`);
}

export function updateCurrentUser(
  name: string,
  cellphone: string
): Promise<void> {
  return fetch("/api/selfmgmt/update", {
    method: "PUT",
    body: JSON.stringify({
      name,
      cellphone,
    }),
  });
}

export function bindWx(appId: string, wxSessionCode: string) {
  return fetch(
    `/api/weixin-auth/bind?appId=${appId}&wxSessionCode=${wxSessionCode}`,
    {
      method: "POST",
    }
  );
}

// 微信解绑
export function unBindWX(): Promise<void> {
  return fetch(`/api/weixin-auth/unbind`, {
    method: "POST",
  });
}

export interface LoginParams {
  username: string;
  pwd: string;
  ValidCode: string;
  uid: string;
}

export async function login(params: LoginParams): Promise<any> {
  const response = await window.fetch(`/CusApi/ComData/userlogin`, {
    method: "POST",
    headers: {
      "Content-type": "Application/x-www-form-urlencoded",
    },
    body: qs.stringify({
      ...params,
    }),
  });

  if (response.status !== 200) {
    throw response;
  }
  const text = await response.text();
  if (text) {
    return JSON.parse(text);
  }
}

export function getToken(): Promise<any> {
  return fetch(`/CusApi/ComData/gettoken`);
}

export async function register(params: LoginParams): Promise<any> {
  const response = await window.fetch(`/CusApi/ComData/register`, {
    method: "POST",
    headers: {
      "Content-type": "Application/x-www-form-urlencoded",
    },
    body: qs.stringify({
      ...params,
    }),
  });
  if (response.status !== 200) {
    throw response;
  }
  const text = await response.text();
  if (text) {
    return JSON.parse(text);
  }
}

export function logout(): Promise<any> {
  return fetch(`/CusApi/ComData/userloginout`, {
    method: "POST",
  });
}
