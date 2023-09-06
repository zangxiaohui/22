import qs from "qs";
import { fetch } from "../lib/fetch";
import { PagedRequest } from "./api";

interface GetCertificationListRequest extends PagedRequest {}

/** 获取其他资质列表 */
export function getCertificationList(
  params: GetCertificationListRequest
): Promise<any> {
  return fetch(`/CusApi/ComData/cusfilelist`, {
    method: "POST",
    body: qs.stringify({
      ...params,
    }),
  });
}

/** 添加资质文件 */
export function createCertification(params: {
  fileurl: string;
  filename: string;
}): Promise<any> {
  return fetch(`/CusApi/ComData/addcusfile`, {
    method: "POST",
    body: qs.stringify({
      ...params,
    }),
  });
}

/** 删除资质文件 */
export function deleteCertification(params: {
  id: number | string;
}): Promise<any> {
  return fetch(`/CusApi/ComData/delcusfile`, {
    method: "POST",
    body: qs.stringify({
      ...params,
    }),
  });
}

interface GetContactListRequest extends PagedRequest {}

/** 获取其他资质列表 */
export function getContactList(params: GetContactListRequest): Promise<any> {
  return fetch(`/CusApi/ComData/cuslxrlist`, {
    method: "POST",
    body: qs.stringify({
      ...params,
    }),
  });
}

/** 设置当前用户公司信息 */
export function updateCompany(params: any): Promise<any> {
  return fetch(`/CusApi/ComData/setcompanyinfo`, {
    method: "POST",
    body: qs.stringify({
      ...params,
    }),
  });
}

/** 需求类别树获取 */
export function getTreeData(): Promise<any> {
  return fetch(`/CusApi/ComData/getxqcatetree`, {
    method: "POST",
  });
}

/** 上传 */
export async function uploadFile(params: FormData): Promise<any> {
  const response = await window.fetch(`/CusApi/ComData/regbusinessfile`, {
    method: "POST",
    body: params,
  });
  return await response.json();
}
