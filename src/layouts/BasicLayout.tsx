import { ConfigProvider, Layout } from "antd";
import classNames from "classnames";
import Omit from "omit.js";
import useMergedState from "rc-util/lib/hooks/useMergedState";
import type { CSSProperties } from "react";
import React, { useContext, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import companyLogo from "../assets/images/logo-blue.svg";
import Footer from "../components/Footer";
import Header from "../components/Header";
import PageLoading from "../components/PageLoading";
import { SiderMenu } from "../components/SiderMenu";
import { useAsync } from "../lib/hooks";
import { getProductCategory } from "../services/api";
import { getCurrentCompany, getSelf, getTelInfo } from "../services/user";
import { getMatchMenu } from "../utils/getMatchMenu";
import { getMenuData } from "../utils/getMenuData";
import type { MenuDataItem, RouterTypes, WithFalse } from "../utils/typings";
import { useCurrentMenuLayoutProps } from "../utils/useCurrentMenuLayoutProps";
import { useBreakpoint } from "../utils/useMediaQuery";
import { clearMenuItem } from "../utils/utils";
import "./BasicLayout.less";
import RouteContext from "./RouteContext";
import { defaultSettings } from "./defaultSettings";

type SiderMenuProps = {};
type HeaderViewProps = any;

type GlobalTypes = Omit<
  Partial<RouterTypes> & SiderMenuProps & HeaderViewProps,
  "collapsed"
>;

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
  return <Header matchMenuKeys={matchMenuKeys} {...props} />;
};

const renderSiderMenu = (
  props: ProLayoutProps,
  matchMenuKeys: string[]
): React.ReactNode => {
  const {
    layout,
    isMobile,
    selectedKeys,
    openKeys,
    splitMenus,
    suppressSiderWhenMenuEmpty,
    menuRender,
  } = props;
  if (props.menuRender === false || props.pure) {
    return null;
  }

  let { menuData } = props;

  /** 如果是分割菜单模式，需要专门实现一下 */
  if (splitMenus && (openKeys !== false || layout === "mix") && !isMobile) {
    const [key] = selectedKeys || matchMenuKeys;
    if (key) {
      menuData =
        props.menuData?.find((item: any) => item.key === key)?.children || [];
    } else {
      menuData = [];
    }
  }

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

  if (menuRender) {
    return menuRender(props, defaultDom);
  }

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
    siderWidth = 308,
    menu,
    loading,
    layout,
  } = props || {};

  const currentUserData = useAsync(getSelf);
  const currentCompanyData = useAsync(getCurrentCompany);
  const telData = useAsync(getTelInfo);
  const productCategory = useAsync(getProductCategory);

  const context = useContext(ConfigProvider.ConfigContext);
  const prefixCls = props.prefixCls ?? context.getPrefixCls("pro");

  const menuData = useMemo(() => {
    return getMenuData(productCategory?.data || []);
  }, [productCategory]);

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
  } as any;

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

  // render sider dom
  const siderMenuDom = renderSiderMenu(
    {
      ...defaultProps,
      menuData,
      onCollapse,
      isMobile,
      collapsed,
      menuItemRender: (item: any, defaultDom: any) => {
        return <Link to={item.path}>{defaultDom}</Link>;
      },
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
          currentUser: {
            ...(currentUserData?.data || {}),
            serviceTel: telData?.data?.Con,
          },
          currentCompany: currentCompanyData?.data || {},
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
            <div
              style={genLayoutStyle}
              className={context.getPrefixCls("layout")}
            >
              {headerDom}
              <Layout.Content>
                {loading ? <PageLoading /> : children}
              </Layout.Content>
              <Footer {...props} />
            </div>
          </Layout>
        </div>
      </RouteContext.Provider>
    </>
  );
};

BasicLayout.defaultProps = {
  ...defaultSettings,
  logo: companyLogo,
  location: window.location,
};

export default BasicLayout;
