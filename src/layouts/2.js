const renderSiderMenu = (
  props: BasicLayoutProps,
  matchMenuKeys: string[]
): React.ReactNode => {
  const { layout, navTheme, isMobile, openKeys, splitMenus, menuRender } =
    props;
  if (props.menuRender === false || props.pure) {
    return null;
  }
  let { menuData } = props;

  /** 如果是分割菜单模式，需要专门实现一下 */
  if (splitMenus && (openKeys !== false || layout === "mix") && !isMobile) {
    const [key] = matchMenuKeys;
    if (key) {
      menuData = props.menuData?.find((item) => item.key === key)?.routes || [];
    } else {
      menuData = [];
    }
  }
  // 这里走了可以少一次循环
  const clearMenuData = clearMenuItem(menuData || []);

  if (clearMenuData && clearMenuData?.length < 1 && splitMenus) {
    return null;
  }
  if (layout === "top" && !isMobile) {
    return <SiderMenu matchMenuKeys={matchMenuKeys} {...props} hide />;
  }

  const defaultDom = (
    <SiderMenu
      matchMenuKeys={matchMenuKeys}
      {...props}
      style={
        navTheme === "realDark"
          ? {
              boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 65%)",
            }
          : {}
      }
      // 这里走了可以少一次循环
      menuData={clearMenuData}
    />
  );
  if (menuRender) {
    return menuRender(props, defaultDom);
  }

  return defaultDom;
};
