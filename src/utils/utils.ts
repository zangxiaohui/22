import type { MenuDataItem } from "./typings";

const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isBrowser = () =>
  typeof window !== "undefined" && typeof window.document !== "undefined";

/** 判断是否是图片链接 */
export function isImg(path: string): boolean {
  return /\w.(png|jpg|jpeg|svg|webp|gif|bmp)$/i.test(path);
}

export const getOpenKeysFromMenuData = (menuData?: MenuDataItem[]) => {
  return (menuData || []).reduce((pre, item) => {
    if (item.key) {
      pre.push(item.key);
    }
    if (item.children || item.routes) {
      const newArray: string[] = pre.concat(
        getOpenKeysFromMenuData(item.children || item.routes) || []
      );
      return newArray;
    }
    return pre;
  }, [] as string[]);
};

export function clearMenuItem(menusData: MenuDataItem[]): MenuDataItem[] {
  return menusData
    .map((item) => {
      const children: MenuDataItem[] = item.children || [];
      const finalItem = { ...item };
      if (!finalItem.children && finalItem.routes) {
        finalItem.children = finalItem.routes;
      }
      if (!finalItem.name || finalItem.hideInMenu) {
        return null;
      }
      if (finalItem && finalItem?.children) {
        if (
          !finalItem.hideChildrenInMenu &&
          children.some((child) => child && child.name && !child.hideInMenu)
        ) {
          return {
            ...item,
            children: clearMenuItem(children),
          };
        }
        // children 为空就直接删掉
        delete finalItem.children;
      }
      delete finalItem.routes;
      return finalItem;
    })
    .filter((item) => item) as MenuDataItem[];
}
