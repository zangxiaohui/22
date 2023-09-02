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
        props.menuData?.find((item) => item.key === key)?.children || [];
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
    return (
      <SiderMenu
        matchMenuKeys={matchMenuKeys}
        {...props}
        hide
        stylish={props.stylish?.sider}
      />
    );
  }

  const defaultDom = (
    <SiderMenu
      matchMenuKeys={matchMenuKeys}
      {...props}
      // 这里走了可以少一次循环
      menuData={clearMenuData}
      stylish={props.stylish?.sider}
    />
  );
  if (menuRender) {
    return menuRender(props, defaultDom);
  }

  return defaultDom;
};
