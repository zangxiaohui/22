import { getMatchMenu } from "@umijs/route-utils";
import { ConfigProvider, Layout } from "antd";
import classNames from "classnames";
import Omit from "omit.js";
import useMergedState from "rc-util/lib/hooks/useMergedState";
import type { CSSProperties } from "react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { DefaultHeader as Header } from "../components/Header";
import PageLoading from "../components/PageLoading";
import { SiderMenu } from "../components/SiderMenu";
import { useBreakpoint } from "../utils/useMediaQuery";
import { clearMenuItem } from "../utils/utils";
// import SiderMenu from "../components/SiderMenu";
import type { MenuDataItem, RouterTypes, WithFalse } from "../utils/typings";
import { useCurrentMenuLayoutProps } from "../utils/useCurrentMenuLayoutProps";
import "./BasicLayout.less";
import RouteContext from "./RouteContext";
import { defaultSettings } from "./defaultSettings";

type SiderMenuProps = {};
type HeaderViewProps = any;

type GlobalTypes = Omit<
  Partial<RouterTypes> & SiderMenuProps & HeaderViewProps,
  "collapsed"
>;

export type MenuDataItem = {
  /** @name 子菜单 */
  children?: MenuDataItem[];
  /** @name 在菜单中隐藏子节点 */
  hideChildrenInMenu?: boolean;
  /** @name 在菜单中隐藏自己和子节点 */
  hideInMenu?: boolean;
  /** @name 菜单的icon */
  icon?: React.ReactNode;
  /** @name 自定义菜单的国际化 key */
  locale?: string | false;
  /** @name 菜单的名字 */
  name?: string;
  /** @name 用于标定选中的值，默认是 path */
  key?: string;
  /** @name disable 菜单选项 */
  disabled?: boolean;
  /** @name 路径,可以设定为网页链接 */
  path?: string;
  /**
   * 当此节点被选中的时候也会选中 parentKeys 的节点
   *
   * @name 自定义父节点
   */
  parentKeys?: string[];
  /** @name 隐藏自己，并且将子节点提升到与自己平级 */
  flatMenu?: boolean;
  /** @name 指定外链打开形式，同a标签 */
  target?: string;
  [key: string]: any;
};

const data: MenuDataItem[] = [
  {
    name: "招标须知",
    key: "1",
  },
  {
    name: "招标竞价",
    key: "2",
    children: [
      {
        name: "全部产品",
        key: "21",
      },
    ],
  },
  {
    name: "新品推荐",
    key: "3",
  },
  {
    name: "我的",
    key: "4",
  },
  {
    name: "联系我们",
    key: "5",
  },
];

export type ProLayoutProps = GlobalTypes & {
  /**
   * @name 简约模式，设置了之后不渲染的任何 layout 的东西，但是会有 context，可以获取到当前菜单。
   *
   * @example pure={true}
   */
  pure?: boolean;

  /**
   * @name layout 的 loading 效果，设置完成之后只展示一个 loading
   *
   * @example loading={true}
   */
  loading?: boolean;

  /**
   * @name 是否收起 layout 是严格受控的，可以 设置为 true，一直收起
   *
   * @example collapsed={true}
   */
  collapsed?: boolean;

  /**
   * @name 收起和展开的时候触发事件
   *
   * @example onCollapse=(collapsed)=>{ setCollapsed(collapsed) };
   */
  onCollapse?: (collapsed: boolean) => void;

  /**
   * @name 页脚的配置
   *
   * @example 不展示dom footerRender={false}
   * @example 使用 layout 的  DefaultFooter   footerRender={() => (<DefaultFooter copyright="这是一条测试文案"/>}
   */
  footerRender?: WithFalse<
    (props: HeaderViewProps, defaultDom: React.ReactNode) => React.ReactNode
  >;

  /**
   * @name 处理 menuData 的数据，可以动态的控制数据
   * @see 尽量不要用异步数据来处理，否则可能造成更新不及时，如果异步数据推荐使用 menu.request 和 params。
   *
   * @example 删除一些菜单 menuDataRender=((menuData) => { return menuData.filter(item => item.name !== 'test') })
   * @example 增加一些菜单 menuDataRender={(menuData) => { return menuData.concat({ path: '/test', name: '测试', icon: 'smile' }) }}
   * @example 修改菜单 menuDataRender={(menuData) => { return menuData.map(item => { if (item.name === 'test') { item.name = '测试' } return item }) }}
   * @example 打平数据 menuDataRender={(menuData) => { return menuData.reduce((pre, item) => { return pre.concat(item.children || []) }, []) }}
   */
  menuDataRender?: (menuData: MenuDataItem[]) => MenuDataItem[];

  /** @name 是否禁用移动端模式
   *
   * @see 有的管理系统不需要移动端模式，此属性设置为true即可
   * @example disableMobile={true}
   *  */
  disableMobile?: boolean;

  /**
   * content 的样式
   *
   * @example 背景颜色为红色 contentStyle={{ backgroundColor: 'red '}}
   */
  contentStyle?: CSSProperties;

  className?: string;

  /**
   * @name 操作菜单重新刷新
   *
   * @example  重新获取菜单 actionRef.current.reload();
   * */
  actionRef?: React.MutableRefObject<
    | {
        reload: () => void;
      }
    | undefined
  >;

  /**
   * @name 错误处理组件
   *
   * @example ErrorBoundary={MyErrorBoundary}
   */
  ErrorBoundary?: React.ComponentClass<any, any> | boolean;

  /**
   * @name  侧边菜单的类型, menu.type 的快捷方式
   * @type "sub" | "group"
   * @example group
   */
  siderMenuType?: "sub" | "group";

  isChildrenLayout?: boolean;
};

const headerRender = (
  props: ProLayoutProps & {
    hasSiderMenu: boolean;
  },
  matchMenuKeys: string[]
): React.ReactNode => {
  console.log("props :>> ", props);
  return <Header matchMenuKeys={matchMenuKeys} {...props} />;
};

const renderSiderMenu = (
  props: ProLayoutProps,
  matchMenuKeys: string[]
): React.ReactNode => {
  const { layout, isMobile, splitMenus, suppressSiderWhenMenuEmpty } = props;

  let { menuData } = props;

  // 这里走了可以少一次循环
  const clearMenuData = clearMenuItem(menuData || []);
  if (
    clearMenuData &&
    clearMenuData?.length < 1 &&
    (splitMenus || suppressSiderWhenMenuEmpty)
  ) {
    return null;
  }

  if (layout === "top" && !isMobile) {
    return <SiderMenu matchMenuKeys={matchMenuKeys} {...props} hide />;
  }

  const defaultDom = (
    <SiderMenu
      matchMenuKeys={matchMenuKeys}
      {...props}
      // 这里走了可以少一次循环
      menuData={clearMenuData}
    />
  );

  return defaultDom;
};

const getPaddingLeft = (
  hasLeftPadding: boolean,
  collapsed: boolean | undefined,
  siderWidth: number
): number | undefined => {
  if (hasLeftPadding) {
    return collapsed ? 48 : siderWidth;
  }
  return 0;
};

const BasicLayout: React.FC<any> = (props) => {
  const {
    children,
    onCollapse: propsOnCollapse,
    location = { pathname: "/" },
    contentStyle,
    defaultCollapsed,
    style,
    disableContentMargin,
    siderWidth = 208,
    menu,
    loading,
    layout,
  } = props || {};
  const context = useContext(ConfigProvider.ConfigContext);
  const prefixCls = props.prefixCls ?? context.getPrefixCls("pro");

  // const [menuData, setMenuData] = useState<any[]>([]);
  const [menuData, setMenuData] = useState<any[]>(data);

  useEffect(() => {
    // setMenuData(data);
  }, []);

  const matchMenus = useMemo(() => {
    return getMatchMenu(location.pathname || "/", menuData || [], true);
  }, [location.pathname, menuData]);

  const matchMenuKeys = useMemo(
    () =>
      Array.from(
        new Set(matchMenus.map((item) => item.key || item.path || ""))
      ),
    [matchMenus]
  );

  // 当前选中的menu，一般不会为空
  const currentMenu = (matchMenus[matchMenus.length - 1] || {}) as any;

  const currentMenuLayoutProps = useCurrentMenuLayoutProps(currentMenu);

  const { fixSiderbar, layout: propsLayout } = {
    ...props,
    ...currentMenuLayoutProps,
  };

  const colSize = useBreakpoint();
  const isMobile = useMemo(() => {
    return (colSize === "sm" || colSize === "xs") && !props.disableMobile;
  }, [colSize, props.disableMobile]);

  // If it is a fix menu, calculate padding
  // don't need padding in phone mode
  const hasLeftPadding = propsLayout !== "top" && !isMobile;

  const [collapsed, onCollapse] = useMergedState<boolean>(
    () => {
      if (defaultCollapsed !== undefined) return defaultCollapsed;
      if (isMobile) return true;
      if (colSize === "md") return true;
      return false;
    },
    {
      value: props.collapsed,
      onChange: propsOnCollapse,
    }
  );

  // Splicing parameters, adding menuData and formatMessage in props
  const defaultProps = Omit(
    {
      prefixCls,
      ...props,
      siderWidth,
      menu: { ...menu, loading: false },
      layout: propsLayout,
    },
    ["className", "style"]
  );

  console.log("menuData :>> ", menuData);

  // render sider dom
  const siderMenuDom = renderSiderMenu(
    {
      ...defaultProps,
      menuData,
      onCollapse,
      isMobile,
      collapsed,
    },
    matchMenuKeys
  );

  // render header dom
  const headerDom = headerRender(
    {
      ...defaultProps,
      children: null,
      hasSiderMenu: !!siderMenuDom,
      menuData,
      isMobile,
      collapsed,
      onCollapse,
    },
    matchMenuKeys
  );

  const baseClassName = `${prefixCls}-basicLayout`;
  // gen className
  const className = classNames(
    props.className,
    "ant-design-pro",
    baseClassName,
    {
      [`screen-${colSize}`]: colSize,
      [`${baseClassName}-top-menu`]: propsLayout === "top",
      [`${baseClassName}-fix-siderbar`]: fixSiderbar,
      [`${baseClassName}-${propsLayout}`]: propsLayout,
    }
  );

  /** 计算 slider 的宽度 */
  const leftSiderWidth = getPaddingLeft(
    !!hasLeftPadding,
    collapsed,
    siderWidth
  );

  // siderMenuDom 为空的时候，不需要 padding
  const genLayoutStyle: CSSProperties = {
    position: "relative",
  };

  const contentClassName = classNames(`${baseClassName}-content`, {
    [`${baseClassName}-has-header`]: headerDom,
    [`${baseClassName}-content-disable-margin`]: disableContentMargin,
  });

  /** 页面切换的时候触发 */
  useEffect(() => {
    props.onPageChange?.(props.location);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.pathname?.search]);

  return (
    <>
      <RouteContext.Provider
        value={{
          ...defaultProps,
          menuData,
          isMobile,
          collapsed,
          siderWidth: leftSiderWidth,
          matchMenus,
          matchMenuKeys,
          currentMenu,
        }}
      >
        <div className={className}>
          <Layout
            style={{
              minHeight: "100%",
              // hack style
              flexDirection: siderMenuDom ? "row" : undefined,
              ...style,
            }}
          >
            {siderMenuDom}
            <div style={genLayoutStyle}>
              {headerDom}
              <Layout.Content>
                {loading ? <PageLoading /> : children}
              </Layout.Content>
            </div>
          </Layout>
        </div>
      </RouteContext.Provider>
    </>
  );
};

const Logo = () => (
  <svg width="32px" height="32px" viewBox="0 0 200 200">
    <defs>
      <linearGradient
        x1="62.1023273%"
        y1="0%"
        x2="108.19718%"
        y2="37.8635764%"
        id="linearGradient-1"
      >
        <stop stopColor="#4285EB" offset="0%" />
        <stop stopColor="#2EC7FF" offset="100%" />
      </linearGradient>
      <linearGradient
        x1="69.644116%"
        y1="0%"
        x2="54.0428975%"
        y2="108.456714%"
        id="linearGradient-2"
      >
        <stop stopColor="#29CDFF" offset="0%" />
        <stop stopColor="#148EFF" offset="37.8600687%" />
        <stop stopColor="#0A60FF" offset="100%" />
      </linearGradient>
      <linearGradient
        x1="69.6908165%"
        y1="-12.9743587%"
        x2="16.7228981%"
        y2="117.391248%"
        id="linearGradient-3"
      >
        <stop stopColor="#FA816E" offset="0%" />
        <stop stopColor="#F74A5C" offset="41.472606%" />
        <stop stopColor="#F51D2C" offset="100%" />
      </linearGradient>
      <linearGradient
        x1="68.1279872%"
        y1="-35.6905737%"
        x2="30.4400914%"
        y2="114.942679%"
        id="linearGradient-4"
      >
        <stop stopColor="#FA8E7D" offset="0%" />
        <stop stopColor="#F74A5C" offset="51.2635191%" />
        <stop stopColor="#F51D2C" offset="100%" />
      </linearGradient>
    </defs>
    <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
      <g transform="translate(-20.000000, -20.000000)">
        <g transform="translate(20.000000, 20.000000)">
          <g>
            <g fillRule="nonzero">
              <g>
                <path
                  d="M91.5880863,4.17652823 L4.17996544,91.5127728 C-0.519240605,96.2081146 -0.519240605,103.791885 4.17996544,108.487227 L91.5880863,195.823472 C96.2872923,200.518814 103.877304,200.518814 108.57651,195.823472 L145.225487,159.204632 C149.433969,154.999611 149.433969,148.181924 145.225487,143.976903 C141.017005,139.771881 134.193707,139.771881 129.985225,143.976903 L102.20193,171.737352 C101.032305,172.906015 99.2571609,172.906015 98.0875359,171.737352 L28.285908,101.993122 C27.1162831,100.824459 27.1162831,99.050775 28.285908,97.8821118 L98.0875359,28.1378823 C99.2571609,26.9692191 101.032305,26.9692191 102.20193,28.1378823 L129.985225,55.8983314 C134.193707,60.1033528 141.017005,60.1033528 145.225487,55.8983314 C149.433969,51.69331 149.433969,44.8756232 145.225487,40.6706018 L108.58055,4.05574592 C103.862049,-0.537986846 96.2692618,-0.500797906 91.5880863,4.17652823 Z"
                  fill="url(#linearGradient-1)"
                />
                <path
                  d="M91.5880863,4.17652823 L4.17996544,91.5127728 C-0.519240605,96.2081146 -0.519240605,103.791885 4.17996544,108.487227 L91.5880863,195.823472 C96.2872923,200.518814 103.877304,200.518814 108.57651,195.823472 L145.225487,159.204632 C149.433969,154.999611 149.433969,148.181924 145.225487,143.976903 C141.017005,139.771881 134.193707,139.771881 129.985225,143.976903 L102.20193,171.737352 C101.032305,172.906015 99.2571609,172.906015 98.0875359,171.737352 L28.285908,101.993122 C27.1162831,100.824459 27.1162831,99.050775 28.285908,97.8821118 L98.0875359,28.1378823 C100.999864,25.6271836 105.751642,20.541824 112.729652,19.3524487 C117.915585,18.4685261 123.585219,20.4140239 129.738554,25.1889424 C125.624663,21.0784292 118.571995,14.0340304 108.58055,4.05574592 C103.862049,-0.537986846 96.2692618,-0.500797906 91.5880863,4.17652823 Z"
                  fill="url(#linearGradient-2)"
                />
              </g>
              <path
                d="M153.685633,135.854579 C157.894115,140.0596 164.717412,140.0596 168.925894,135.854579 L195.959977,108.842726 C200.659183,104.147384 200.659183,96.5636133 195.960527,91.8688194 L168.690777,64.7181159 C164.472332,60.5180858 157.646868,60.5241425 153.435895,64.7316526 C149.227413,68.936674 149.227413,75.7543607 153.435895,79.9593821 L171.854035,98.3623765 C173.02366,99.5310396 173.02366,101.304724 171.854035,102.473387 L153.685633,120.626849 C149.47715,124.83187 149.47715,131.649557 153.685633,135.854579 Z"
                fill="url(#linearGradient-3)"
              />
            </g>
            <ellipse
              fill="url(#linearGradient-4)"
              cx="100.519339"
              cy="100.436681"
              rx="23.6001926"
              ry="23.580786"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

BasicLayout.defaultProps = {
  logo: <Logo />,
  ...defaultSettings,
  location: window.location,
};

export default BasicLayout;
