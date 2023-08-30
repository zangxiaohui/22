import { Breadcrumb as AntDBreadcrumb } from "antd";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import classNames from "classnames";
import React from "react";
import { useHistory } from "react-router-dom";
import styles from "./index.module.scss";

export interface BreadcrumbRoute extends Omit<Route, "path"> {
  path?: string;
}

export interface BreadcrumbProps {
  routes: BreadcrumbRoute[] | undefined;
}

interface BreadcrumbItemProps {
  route: BreadcrumbRoute;
  routes: BreadcrumbRoute[];
  index: number;
}

const BreadcrumbItem: React.FC<BreadcrumbItemProps> = (props) => {
  const {
    route: { breadcrumbName, path },
    routes,
    index,
  } = props;
  const routeHistory = useHistory();

  const isLast = index === routes.length - 1;
  const splitRender = isLast ? (
    <span />
  ) : (
    <span className={styles.split}>/</span>
  );
  let breadItem: React.ReactNode;

  if (!path) {
    breadItem = <span>{breadcrumbName}</span>;
  } else {
    breadItem = (
      <AntDBreadcrumb.Item separator="" onClick={() => routeHistory.push(path)}>
        {breadcrumbName}
      </AntDBreadcrumb.Item>
    );
  }

  return (
    <span className={classNames(styles.item, isLast && styles.active)}>
      {breadItem}
      {splitRender}
    </span>
  );
};

const Breadcrumb: React.FC<BreadcrumbProps> = (props) => {
  const { routes } = props;

  if (!routes) return <div />;

  return (
    <div className={styles.breadcrumb}>
      {routes.map((route, index) => (
        <BreadcrumbItem
          key={route.breadcrumbName + index}
          route={route}
          index={index}
          routes={routes}
        />
      ))}
    </div>
  );
};

export default Breadcrumb;
