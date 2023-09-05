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
  currentUser?: any;
} & Partial<PureSettings>;

const routeContext: React.Context<RouteContextType> = createContext({});

export function useSelf() {
  const { currentUser } = useContext(routeContext);
  return currentUser;
}

export default routeContext;
