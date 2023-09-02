import { useMountMergeState } from "@ant-design/pro-utils";
import type { MenuProps } from "antd";
import { Menu, Skeleton } from "antd";
import classNames from "classnames";
import React, { useEffect, useMemo, useRef } from "react";
import type {
  MenuDataItem,
  MessageDescriptor,
  RouterTypes,
  WithFalse,
} from "../../utils/typings";
import { getOpenKeysFromMenuData } from "../../utils/utils";
import type { PrivateSiderMenuProps } from "./SiderMenu";
import "./index.less";
import { MenuUtil } from "./utils";

type PureSettings = any;
// todo
export type MenuMode =
  | "vertical"
  | "vertical-left"
  | "vertical-right"
  | "horizontal"
  | "inline";

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

  const dark = false;

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
      // to do 图标
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
  const xx = menuUtils.getNavMenuItems(finallyData, 0);
  console.log("xx :>> ", xx);

  const items = [
    { label: "菜单项一", key: "item-1" }, // 菜单项务必填写 key
    { label: "菜单项二", key: "item-2" },
    {
      label: "子菜单",
      key: "submenu",
      children: [{ label: "子菜单项", key: "submenu-item-1" }],
    },
  ];

  return (
    <Menu
      {...openKeysProps}
      key="Menu"
      mode={mode}
      inlineIndent={16}
      defaultOpenKeys={defaultOpenKeysRef.current}
      theme={dark ? "dark" : "light"}
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
      items={items}
      onOpenChange={(_openKeys: React.Key[]) => {
        if (!props.collapsed) {
          setOpenKeys(_openKeys);
        }
      }}
      {...props.menuProps}
    />
  );
};

export { BaseMenu };
