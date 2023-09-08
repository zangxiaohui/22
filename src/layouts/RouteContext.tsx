import { createContext, useContext } from "react";
import type { PureSettings } from "./defaultSettings";

export type RouteContextType = {
  // menuData?: MenuDataItem[];
  menuData?: any[];
  isMobile?: boolean;
  collapsed?: boolean;
  hasSiderMenu?: boolean;
  hasHeader?: boolean;
  siderWidth?: number;
  isChildrenLayout?: boolean;
  hasFooter?: boolean;
  // matchMenus?: MenuDataItem[];
  // matchMenuKeys?: string[];
  // currentMenu?: PureSettings & MenuDataItem;

  matchMenus?: any[];
  matchMenuKeys?: any[];
  currentMenu?: any;
  currentUser?: {
    Address?: string;
    Email?: string;
    Name?: string;
    Phone?: string;
    RealName?: string;
    serviceTel?: string;
    ismain: boolean; // 是否是主要联系人
    companystate: boolean; // 公司信息是否审核
    userstate: boolean; // 当前登录账号是否审核
  };
  currentCompany?: {
    Name?: string;
    Nsrsbh?: string;
    XqCateIds?: string;
    YyzzImage?: string;
  };
} & Partial<PureSettings>;

const routeContext: React.Context<RouteContextType> = createContext({});

export function useSelf() {
  const { currentUser } = useContext(routeContext);
  return currentUser;
}

export function useCurrentCompany() {
  const { currentCompany } = useContext(routeContext);
  return currentCompany;
}

export default routeContext;
