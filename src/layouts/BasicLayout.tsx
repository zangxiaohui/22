import { Spin } from "antd";
import classNames from "classnames";
import React, {
  PropsWithChildren,
  useEffect,
  useReducer,
  useState,
} from "react";
import { Redirect, useLocation } from "react-router-dom";
import GlobalFooter from "../components/GlobalFooter";
import GlobalHeader from "../components/GlobalHeader";
import Authorized from "../utils/Authorized";
import styles from "./BasicLayout.module.scss";
import { SubViewContext } from "./SubviewContext";

interface BasicLayoutProps {}

const BasicLayout: React.FC<PropsWithChildren<BasicLayoutProps>> = ({
  children,
}) => {
  const [x, forceUpdate] = useReducer((x) => x + 1, 1);
  const [loading, setLoading] = useState<boolean>(false);
  const [customerUser, setCustomerUser] = useState<any>();
  const [currentProject, setCurrentProject] = useState<string>();
  const { pathname } = useLocation();

  useEffect(() => {
    setLoading(true);
  }, [x]);

  useEffect(() => {
    let interval: number = 0;
    interval = window.setInterval(() => {}, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.oncontextmenu = function (e) {
      return false;
    };
  }, []);

  useEffect(() => {}, []);

  if (!customerUser || loading) {
    return <Spin className={styles.spinContainer} />;
  }
  return (
    <Authorized authority={["admin"]} noMatch={<Redirect to="/login" />}>
      <SubViewContext.Provider
        value={{
          user: customerUser,
          projectName: currentProject,
        }}
      >
        <div
          className={classNames(styles.container, {
            [styles.homePage]: pathname === "/home",
          })}
        >
          <GlobalHeader userData={customerUser} forceUpdate={forceUpdate} />
          <div className={styles.content}>{children}</div>
          <div className={styles.footer}>
            <GlobalFooter />
          </div>
        </div>
      </SubViewContext.Provider>
    </Authorized>
  );
};

export default BasicLayout;
