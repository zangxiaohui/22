import { createFromIconfontCN } from "@ant-design/icons";
import { isImg, isUrl, useMountMergeState } from "@ant-design/pro-utils";
import type { MenuProps } from "antd";
import { Menu, Skeleton, Tooltip } from "antd";
import type { ItemType } from "antd/lib/menu/hooks/useItems";
import classNames from "classnames";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { PureSettings } from "../../layouts/defaultSettings";
import { defaultSettings } from "../../layouts/defaultSettings";
import type {
  MenuDataItem,
  MessageDescriptor,
  RouterTypes,
  WithFalse,
} from "../../utils/typings";
import { getOpenKeysFromMenuData } from "../../utils/utils";
import type { PrivateSiderMenuProps } from "./SiderMenu";

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
      open={collapsed && props.collapsed ? open : false}
      placement="right"
      onOpenChange={setOpen}
    >
      {props.children}
    </Tooltip>
  );
};

export type BaseMenuProps = {
  className?: string;
  /** 默认的是否展开，会受到 breakpoint 的影响 */
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  splitMenus?: boolean;
  isMobile?: boolean;
  menuData?: MenuDataItem[];
  mode?: MenuMode;
  onCollapse?: (collapsed: boolean) => void;
  openKeys?: WithFalse<string[]> | undefined;
  handleOpenChange?: (openKeys: string[]) => void;
  iconPrefixes?: string;
  /** 要给菜单的props, 参考antd-menu的属性。https://ant.design/components/menu-cn/ */
  menuProps?: MenuProps;
  style?: React.CSSProperties;
  formatMessage?: (message: MessageDescriptor) => string;

  /**
   * @name 处理父级菜单的 props，可以复写菜单的点击功能，一般用于埋点
   * @see 子级的菜单要使用 menuItemRender 来处理
   *
   * @example 使用 a 标签跳转到特殊的地址 subMenuItemRender={(item, defaultDom) => { return <a onClick={()=> history.push(item.path) }>{defaultDom}</a> }}
   * @example 增加埋点 subMenuItemRender={(item, defaultDom) => { return <a onClick={()=> log.click(item.name) }>{defaultDom}</a> }}
   */
  subMenuItemRender?: WithFalse<
    (
      item: MenuDataItem & {
        isUrl: boolean;
      },
      defaultDom: React.ReactNode,
      menuProps: BaseMenuProps
    ) => React.ReactNode
  >;

  /**
   * @name 处理菜单的 props，可以复写菜单的点击功能，一般结合 Router 框架使用
   * @see 非子级的菜单要使用 subMenuItemRender 来处理
   *
   * @example 使用 a 标签 menuItemRender={(item, defaultDom) => { return <a onClick={()=> history.push(item.path) }>{defaultDom}</a> }}
   * @example 使用 Link 标签 menuItemRender={(item, defaultDom) => { return <Link to={item.path}>{defaultDom}</Link> }}
   */
  menuItemRender?: WithFalse<
    (
      item: MenuDataItem & {
        isUrl: boolean;
        onClick: () => void;
      },
      defaultDom: React.ReactNode,
      menuProps: BaseMenuProps & Partial<PrivateSiderMenuProps>
    ) => React.ReactNode
  >;

  /**
   * @name 处理 menuData 的方法，与 menuDataRender 不同，postMenuData处理完成后会直接渲染，不再进行国际化和拼接处理
   *
   * @example 增加菜单图标 postMenuData={(menuData) => { return menuData.map(item => { return { ...item, icon: <Icon type={item.icon} /> } }) }}
   */
  postMenuData?: (menusData?: MenuDataItem[]) => MenuDataItem[];
} & Partial<RouterTypes> &
  Omit<MenuProps, "openKeys" | "onOpenChange" | "title"> &
  Partial<PureSettings>;

let IconFont = createFromIconfontCN({
  scriptUrl: defaultSettings.iconfontUrl,
});

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
      return <IconFont type={icon} />;
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
    menuRenderType?: "header" | "sider";
    baseClassName: string;
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

    const name = this.getIntlName(item);
    const children = item?.children || item?.routes;

    const menuType = isGroup && level === 0 ? ("group" as const) : undefined;

    if (Array.isArray(children) && children.length > 0) {
      /** Menu 第一级可以有icon，或者 isGroup 时第二级别也要有 */
      const shouldHasIcon = level === 0 || (isGroup && level === 1);

      //  get defaultTitle by menuItemRender
      const iconDom = getIcon(item.icon, iconPrefixes, `${baseClassName}-icon`);
      /**
       * 如果没有icon在收起的时候用首字母代替
       */
      const defaultIcon =
        collapsed && shouldHasIcon ? getMenuTitleSymbol(name) : null;

      const defaultTitle = (
        <div
          className={classNames(`${baseClassName}-item-title`, {
            [`${baseClassName}-item-title-collapsed`]: collapsed,
            [`${baseClassName}-item-title-collapsed-level-${level}`]: collapsed,
            [`${baseClassName}-group-item-title`]: menuType === "group",
            [`${baseClassName}-item-collapsed-show-title`]:
              menu?.collapsedShowTitle && collapsed,
          })}
        >
          {/* 收起的时候group模式就不要展示icon了，放不下 */}
          {menuType === "group" && collapsed ? null : shouldHasIcon &&
            iconDom ? (
            <span
              className={`${baseClassName}-item-icon ${item.iconClassName}`}
            >
              {iconDom}
            </span>
          ) : (
            defaultIcon
          )}
          <span
            className={classNames(`${baseClassName}-item-text`, {
              [`${baseClassName}-item-text-has-icon`]:
                menuType !== "group" &&
                shouldHasIcon &&
                (iconDom || defaultIcon),
            })}
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
    const {
      location = { pathname: "/" },
      isMobile,
      onCollapse,
      menuItemRender,
      iconPrefixes,
    } = this.props;

    // if local is true formatMessage all name。
    const menuItemTitle = this.getIntlName(item);
    const { baseClassName, menu, collapsed } = this.props;
    const isGroup = menu?.type === "group";
    /** Menu 第一级可以有icon，或者 isGroup 时第二级别也要有 */
    const hasIcon = level === 0 || (isGroup && level === 1);
    const icon = !hasIcon
      ? null
      : getIcon(item.icon, iconPrefixes, `${baseClassName}-icon`);

    // 如果没有 icon 在收起的时候用首字母代替
    const defaultIcon =
      collapsed && hasIcon ? getMenuTitleSymbol(menuItemTitle) : null;

    let defaultItem = (
      <div
        key={itemPath}
        className={classNames(`${baseClassName}-item-title`, {
          [`${baseClassName}-item-title-collapsed`]: collapsed,
          [`${baseClassName}-item-title-collapsed-level-${level}`]: collapsed,
          [`${baseClassName}-item-collapsed-show-title`]:
            menu?.collapsedShowTitle && collapsed,
        })}
      >
        <span
          className={`${baseClassName}-item-icon ${item.iconClassName}`.trim()}
          style={{
            display: defaultIcon === null && !icon ? "none" : "",
          }}
        >
          {icon || <span className="anticon">{defaultIcon}</span>}
        </span>
        <span
          className={classNames(`${baseClassName}-item-text`, {
            [`${baseClassName}-item-text-has-icon`]:
              hasIcon && (icon || defaultIcon),
          })}
        >
          {menuItemTitle}
        </span>
      </div>
    );
    const isHttpUrl = isUrl(itemPath);

    // Is it a http link
    if (isHttpUrl) {
      defaultItem = (
        <span
          key={itemPath}
          onClick={() => {
            window?.open?.(itemPath, "_blank");
          }}
          className={classNames(`${baseClassName}-item-title`, {
            [`${baseClassName}-item-title-collapsed`]: collapsed,
            [`${baseClassName}-item-title-collapsed-level-${level}`]: collapsed,
            [`${baseClassName}-item-link`]: true,
            [`${baseClassName}-item-collapsed-show-title`]:
              menu?.collapsedShowTitle && collapsed,
          })}
        >
          <span
            className={`${baseClassName}-item-icon ${item.iconClassName}`}
            style={{
              display: defaultIcon === null && !icon ? "none" : "",
            }}
          >
            {icon || <span className="anticon">{defaultIcon}</span>}
          </span>
          <span
            className={classNames(`${baseClassName}-item-text`, {
              [`${baseClassName}-item-text-has-icon`]:
                hasIcon && (icon || defaultIcon),
            })}
          >
            {menuItemTitle}
          </span>
        </span>
      );
    }
    if (menuItemRender) {
      const renderItemProps = {
        ...item,
        isUrl: isHttpUrl,
        itemPath,
        isMobile,
        replace: itemPath === location.pathname,
        onClick: () => onCollapse && onCollapse(true),
        children: undefined,
      };
      return level === 0 ? (
        <MenuItemTooltip
          collapsed={collapsed}
          title={menuItemTitle}
          disable={item.disabledTooltip}
        >
          {menuItemRender(renderItemProps, defaultItem, this.props)}
        </MenuItemTooltip>
      ) : (
        menuItemRender(renderItemProps, defaultItem, this.props)
      );
    }
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

/**
 * 生成openKeys 的对象，因为设置了openKeys 就会变成受控，所以需要一个空对象
 *
 * @param BaseMenuProps
 */
const getOpenKeysProps = (
  openKeys: (string | number)[] | false,
  { layout, collapsed }: BaseMenuProps
): {
  openKeys?: undefined | string[];
} => {
  let openKeysProps = {};

  if (openKeys && !collapsed && ["side", "mix"].includes(layout || "mix")) {
    openKeysProps = {
      openKeys,
    };
  }
  return openKeysProps;
};

const BaseMenu: React.FC<BaseMenuProps & PrivateSiderMenuProps> = (props) => {
  const {
    mode,
    className,
    handleOpenChange,
    style,
    menuData,
    prefixCls,
    menu,
    matchMenuKeys,
    iconfontUrl,
    selectedKeys: propsSelectedKeys,
    onSelect,
    menuRenderType,
    openKeys: propsOpenKeys,
  } = props;

  const baseClassName = `${prefixCls}-base-menu-${mode}`;
  // 用于减少 defaultOpenKeys 计算的组件
  const defaultOpenKeysRef = useRef<string[]>([]);

  const [defaultOpenAll, setDefaultOpenAll] = useMountMergeState(
    menu?.defaultOpenAll
  );

  const [openKeys, setOpenKeys] = useMountMergeState<WithFalse<React.Key[]>>(
    () => {
      if (menu?.defaultOpenAll) {
        return getOpenKeysFromMenuData(menuData) || [];
      }
      if (propsOpenKeys === false) {
        return false;
      }
      return [];
    },
    {
      value: propsOpenKeys === false ? undefined : propsOpenKeys,
      onChange: handleOpenChange as any,
    }
  );

  const [selectedKeys, setSelectedKeys] = useMountMergeState<
    string[] | undefined
  >([], {
    value: propsSelectedKeys,
    onChange: onSelect
      ? (keys) => {
          if (onSelect && keys) {
            onSelect(keys as any);
          }
        }
      : undefined,
  });

  useEffect(() => {
    if (menu?.defaultOpenAll || propsOpenKeys === false) {
      return;
    }
    if (matchMenuKeys) {
      setOpenKeys(matchMenuKeys);
      setSelectedKeys(matchMenuKeys);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchMenuKeys.join("-")]);

  useEffect(() => {
    // reset IconFont
    if (iconfontUrl) {
      IconFont = createFromIconfontCN({
        scriptUrl: iconfontUrl,
      });
    }
  }, [iconfontUrl]);

  useEffect(
    () => {
      // if pathname can't match, use the nearest parent's key
      if (matchMenuKeys.join("-") !== (selectedKeys || []).join("-")) {
        setSelectedKeys(matchMenuKeys);
      }
      if (
        !defaultOpenAll &&
        propsOpenKeys !== false &&
        matchMenuKeys.join("-") !== (openKeys || []).join("-")
      ) {
        let newKeys: React.Key[] = matchMenuKeys;
        // 如果不自动关闭，我需要把 openKeys 放进去
        if (menu?.autoClose === false) {
          newKeys = Array.from(
            new Set([...matchMenuKeys, ...(openKeys || [])])
          );
        }
        setOpenKeys(newKeys);
      } else if (menu?.ignoreFlatMenu && defaultOpenAll) {
        // 忽略用户手动折叠过的菜单状态，折叠按钮切换之后也可实现默认展开所有菜单
        setOpenKeys(getOpenKeysFromMenuData(menuData));
      } else {
        setDefaultOpenAll(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [matchMenuKeys.join("-")]
  );

  const openKeysProps = useMemo(
    () => getOpenKeysProps(openKeys, props),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [openKeys && openKeys.join(","), props.layout, props.collapsed]
  );

  const menuUtils = useMemo(() => {
    return new MenuUtil({
      ...props,
      menuRenderType,
      baseClassName,
    });
  }, [props, menuRenderType, baseClassName]);

  if (menu?.loading) {
    return (
      <div
        style={
          mode?.includes("inline")
            ? { padding: 24 }
            : {
                marginBlockStart: 16,
              }
        }
      >
        <Skeleton
          active
          title={false}
          paragraph={{
            rows: mode?.includes("inline") ? 6 : 1,
          }}
        />
      </div>
    );
  }

  // 这次 openKeys === false 的时候的情况，这种情况下帮用户选中一次
  // 第二此不会使用，所以用了 defaultOpenKeys
  // 这里返回 null，是为了让 defaultOpenKeys 生效
  if (props.openKeys === false && !props.handleOpenChange) {
    defaultOpenKeysRef.current = matchMenuKeys;
  }

  const finallyData = props.postMenuData
    ? props.postMenuData(menuData)
    : menuData;

  if (finallyData && finallyData?.length < 1) {
    return null;
  }

  return (
    <div className="menu-wrap">
      <Menu
        {...openKeysProps}
        key="Menu"
        mode={mode}
        // inlineIndent={16}
        inlineIndent={30}
        defaultOpenKeys={defaultOpenKeysRef.current}
        // theme={dark ? 'dark' : 'light'}
        theme="dark"
        selectedKeys={selectedKeys}
        style={{
          backgroundColor: "transparent",
          border: "none",
          ...style,
        }}
        className={classNames(className, baseClassName, {
          [`${baseClassName}-horizontal`]: mode === "horizontal",
          [`${baseClassName}-collapsed`]: props.collapsed,
        })}
        items={menuUtils.getNavMenuItems(finallyData, 0)}
        onOpenChange={(_openKeys: React.Key[]) => {
          if (!props.collapsed) {
            setOpenKeys(_openKeys);
          }
        }}
        {...props.menuProps}
      />
    </div>
  );
};

export { BaseMenu };
