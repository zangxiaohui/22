import { isImg, isUrl } from "@ant-design/pro-utils";
import { Tooltip } from "antd";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import type { MenuDataItem } from "../../utils/typings";
import { BaseMenuProps } from "./BaseMenu";
import "./index.less";

type ProTokenType = any;
type ItemType = any;
// todo
export type MenuMode =
  | "vertical"
  | "vertical-left"
  | "vertical-right"
  | "horizontal"
  | "inline";

const MenuItemTooltip = (props: {
  collapsed?: boolean;
  children: React.ReactNode;
  title?: React.ReactNode;
  disable?: boolean;
}) => {
  const [collapsed, setCollapsed] = useState(props.collapsed);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(false);
    setTimeout(() => {
      setCollapsed(props.collapsed);
    }, 400);
  }, [props.collapsed]);

  if (props.disable) {
    return props.children as JSX.Element;
  }

  return (
    <Tooltip
      title={props.title}
      visible={collapsed && props.collapsed ? open : false}
      placement="right"
      onOpenChange={setOpen}
    >
      {props.children}
    </Tooltip>
  );
};

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'icon-geren' #For Iconfont ,
//   icon: 'http://demo.com/icon.png',
//   icon: '/favicon.png',
//   icon: <Icon type="setting" />,
const getIcon = (
  icon: string | React.ReactNode,
  iconPrefixes: string = "icon-",
  className: string
): React.ReactNode => {
  if (typeof icon === "string" && icon !== "") {
    if (isUrl(icon) || isImg(icon)) {
      return (
        <img
          width={16}
          key={icon}
          src={icon}
          alt="icon"
          className={className}
        />
      );
    }
    if (icon.startsWith(iconPrefixes)) {
      return <span>123</span>;
    }
  }
  return icon;
};

const getMenuTitleSymbol = (title: React.ReactNode) => {
  if (title && typeof title === "string") {
    const symbol = title.substring(0, 1).toUpperCase();
    return symbol;
  }
  return null;
};

class MenuUtil {
  constructor(props: any) {
    this.props = props;
  }

  props: BaseMenuProps & {
    token?: ProTokenType;
    menuRenderType?: "header" | "sider";
    baseClassName: string;
    hashId: string;
  };

  getNavMenuItems = (
    menusData: MenuDataItem[] = [],
    level: number
  ): ItemType[] =>
    menusData
      .map((item) => this.getSubMenuOrItem(item, level))
      .filter((item) => item)
      .flat(1);

  /** Get SubMenu or Item */
  getSubMenuOrItem = (
    item: MenuDataItem,
    level: number
  ): ItemType | ItemType[] => {
    const {
      subMenuItemRender,
      baseClassName,
      prefixCls,
      collapsed,
      menu,
      iconPrefixes,
      layout,
    } = this.props;
    const isGroup = menu?.type === "group" && layout !== "top";
    const designToken = this.props.token;

    const name = this.getIntlName(item);
    const children = item?.children || item?.routes;

    const menuType = isGroup && level === 0 ? ("group" as const) : undefined;

    if (Array.isArray(children) && children.length > 0) {
      /** Menu 第一级可以有icon，或者 isGroup 时第二级别也要有 */
      const shouldHasIcon = level === 0 || (isGroup && level === 1);

      //  get defaultTitle by menuItemRender
      const iconDom = getIcon(
        item.icon,
        iconPrefixes,
        `${baseClassName}-icon ${this.props?.hashId}`
      );
      /**
       * 如果没有icon在收起的时候用首字母代替
       */
      const defaultIcon =
        collapsed && shouldHasIcon ? getMenuTitleSymbol(name) : null;

      const defaultTitle = (
        <div
          className={classNames(
            `${baseClassName}-item-title`,
            this.props?.hashId,
            {
              [`${baseClassName}-item-title-collapsed`]: collapsed,
              [`${baseClassName}-item-title-collapsed-level-${level}`]:
                collapsed,
              [`${baseClassName}-group-item-title`]: menuType === "group",
              [`${baseClassName}-item-collapsed-show-title`]:
                menu?.collapsedShowTitle && collapsed,
            }
          )}
        >
          {/* 收起的时候group模式就不要展示icon了，放不下 */}
          {menuType === "group" && collapsed ? null : shouldHasIcon &&
            iconDom ? (
            <span
              className={`${baseClassName}-item-icon ${this.props?.hashId}`.trim()}
            >
              {iconDom}
            </span>
          ) : (
            defaultIcon
          )}
          <span
            className={classNames(
              `${baseClassName}-item-text`,
              this.props?.hashId,
              {
                [`${baseClassName}-item-text-has-icon`]:
                  menuType !== "group" &&
                  shouldHasIcon &&
                  (iconDom || defaultIcon),
              }
            )}
          >
            {name}
          </span>
        </div>
      );

      // subMenu only title render
      const title = subMenuItemRender
        ? subMenuItemRender({ ...item, isUrl: false }, defaultTitle, this.props)
        : defaultTitle;

      const childrenList = this.getNavMenuItems(children, level + 1);
      if (
        isGroup &&
        level === 0 &&
        this.props.collapsed &&
        !menu.collapsedShowGroupTitle
      ) {
        return childrenList;
      }

      return [
        {
          type: menuType,
          key: item.key! || item.path!,
          label: title,
          onClick: isGroup ? undefined : item.onTitleClick,
          children: childrenList,
          className: classNames({
            [`${baseClassName}-group`]: menuType === "group",
            [`${baseClassName}-submenu`]: menuType !== "group",
            [`${baseClassName}-submenu-has-icon`]:
              menuType !== "group" && shouldHasIcon && iconDom,
          }),
        } as ItemType,
        isGroup && level === 0
          ? ({
              type: "divider",
              prefixCls,
              className: `${baseClassName}-divider`,
              key: (item.key! || item.path!) + "-group-divider",
              style: {
                padding: 0,
                borderBlockEnd: 0,
                margin: this.props.collapsed ? "4px" : "6px 16px",
                marginBlockStart: this.props.collapsed ? 4 : 8,
                borderColor: designToken?.layout?.sider?.colorMenuItemDivider,
              },
            } as ItemType)
          : undefined,
      ].filter(Boolean) as ItemType[];
    }

    return {
      className: `${baseClassName}-menu-item`,
      disabled: item.disabled,
      key: item.key! || item.path!,
      onClick: item.onTitleClick,
      label: this.getMenuItemPath(item, level),
    };
  };

  getIntlName = (item: MenuDataItem) => {
    const { name, locale } = item;
    const { menu, formatMessage } = this.props;
    if (locale && menu?.locale !== false) {
      return formatMessage?.({
        id: locale,
        defaultMessage: name,
      });
    }
    return name;
  };

  /**
   * 判断是否是http链接.返回 Link 或 a Judge whether it is http link.return a or Link
   *
   * @memberof SiderMenu
   */
  getMenuItemPath = (item: MenuDataItem, level: number) => {
    const itemPath = this.conversionPath(item.path || "/");
    const { iconPrefixes } = this.props;
    console.log("itemPath :>> ", itemPath);

    // if local is true formatMessage all name。
    const menuItemTitle = this.getIntlName(item);
    const { baseClassName, menu, collapsed } = this.props;
    const isGroup = menu?.type === "group";
    /** Menu 第一级可以有icon，或者 isGroup 时第二级别也要有 */
    const hasIcon = level === 0 || (isGroup && level === 1);
    const icon = !hasIcon
      ? null
      : getIcon(
          item.icon,
          iconPrefixes,
          `${baseClassName}-icon ${this.props?.hashId}`
        );

    // 如果没有 icon 在收起的时候用首字母代替
    const defaultIcon =
      collapsed && hasIcon ? getMenuTitleSymbol(menuItemTitle) : null;

    let defaultItem = (
      <div
        key={itemPath}
        className={classNames(
          `${baseClassName}-item-title`,
          this.props?.hashId,
          {
            [`${baseClassName}-item-title-collapsed`]: collapsed,
            [`${baseClassName}-item-title-collapsed-level-${level}`]: collapsed,
            [`${baseClassName}-item-collapsed-show-title`]:
              menu?.collapsedShowTitle && collapsed,
          }
        )}
      >
        <span
          className={`${baseClassName}-item-icon ${this.props?.hashId}`.trim()}
          style={{
            display: defaultIcon === null && !icon ? "none" : "",
          }}
        >
          {icon || <span className="anticon">{defaultIcon}</span>}
        </span>
        <span
          className={classNames(
            `${baseClassName}-item-text`,
            this.props?.hashId,
            {
              [`${baseClassName}-item-text-has-icon`]:
                hasIcon && (icon || defaultIcon),
            }
          )}
        >
          {menuItemTitle}
        </span>
      </div>
    );

    return level === 0 ? (
      <MenuItemTooltip
        collapsed={collapsed}
        title={menuItemTitle}
        disable={item.disabledTooltip}
      >
        {defaultItem}
      </MenuItemTooltip>
    ) : (
      defaultItem
    );
  };

  conversionPath = (path: string) => {
    if (path && path.indexOf("http") === 0) {
      return path;
    }
    return `/${path || ""}`.replace(/\/+/g, "/");
  };
}

export { MenuUtil };
