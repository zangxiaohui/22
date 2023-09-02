import { createContext } from "react";
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
} & Partial<PureSettings>;

const routeContext: React.Context<RouteContextType> = createContext({});

export default routeContext;
