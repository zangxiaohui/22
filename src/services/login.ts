import qs from "qs";
import { fetch } from "../lib/fetch";

// export enum AFSErrorCode {
//   SUCCESS_1 = "100",
//   SUCCESS_2 = "200",
//   NEED_NC = "400",
//   BLOCK_1 = "800",
//   BLOCK_2 = "900",
// }

export interface SMSTokenResponse {
  limit: number;
  // bizSuccess: boolean;
  // bizErrorCode?: AFSErrorCode;
}

export function sendSMSToken(cellphone: string): Promise<SMSTokenResponse> {
  return fetch("/api/selfmgmt/sendtoken", {
    method: "POST",
    body: JSON.stringify({
      cellphone,
    }),
  });
}

export function sendLoginSMSToken(
  cellphone: string
): Promise<SMSTokenResponse> {
  return fetch("/cs/login/sms", {
    method: "POST",
    body: JSON.stringify({
      cellphone,
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
  cellphone: string;
  newPassword: string;
  token: string;
}

export function forgotResetPassword(
  request: forgotResetPasswordRequest
): Promise<void> {
  return fetch("/api/selfmgmt/forgetpassword", {
    method: "POST",
    body: JSON.stringify(request),
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
  const search = window.location.search;
  const parseSearch: any = qs.parse(search.replace("?", ""));

  const response = await window.fetch(`/CusApi/ComData/userlogin`, {
    method: "POST",
    headers: {
      "Content-type": "Application/x-www-form-urlencoded",
    },
    body: qs.stringify({
      ...params,
    }),
  });

  console.log("response :>> ", response);

  if (response.status !== 200) {
    throw response;
  }
  const text = await response.text();
  if (text) {
    return JSON.parse(text);
  }

  // if (ticketRes.status !== 200) {
  //   throw ticketRes;
  // }
  // const ticket = await ticketRes.text();
  // const url = new URL(parseSearch.service);
  // const parseRedirectSearch = qs.parse(url.search, { ignoreQueryPrefix: true });
  // window.location.replace("/");
}

// export async function postLogin1(params: PostLoginRequest): Promise<void> {
//   const response = await window.fetch(`${BASE}/login`, {
//     method: "POST",
//     headers: {
//       "Content-type": "application/json",
//     },
//     body: JSON.stringify(params),
//   });
//   if (response.status !== 200) {
//     throw response;
//   }
// }

export function getToken(): Promise<any> {
  return fetch(`/CusApi/ComData/gettoken`);
}
