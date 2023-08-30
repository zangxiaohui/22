import { SettingOutlined } from "@ant-design/icons";
import classNames from "classnames";
import React from "react";
import { Link } from "react-router-dom";
import icon1 from "../../assets/images/icon1.png";
import icon2 from "../../assets/images/icon2.png";
import icon3 from "../../assets/images/icon3.png";
import icon4 from "../../assets/images/icon4.png";
import { useSelf } from "../../layouts/SubviewContext";
import "./index.scss";

interface MainMenuProps {
  mode: "horizontal" | "inline";
}
const MainMenu: React.FC<MainMenuProps> = (props) => {
  const { mode } = props;
  const currentUser = useSelf();
  return (
    <div
      className={classNames("menuWrap", {
        horizontal: mode === "horizontal",
        inline: mode === "inline",
      })}
    >
      <ul className="ca-menu">
        <li>
          <Link to="/thermalPic">
            <span className="ca-icon">
              <img src={icon1} alt="" />
            </span>
            <div className="ca-content">
              <h2 className="ca-main">测温图纸</h2>
              <h3 className="ca-sub">小字说明文字</h3>
            </div>
          </Link>
        </li>
        <li>
          <Link to="/thermalData">
            <span className="ca-icon">
              <img src={icon2} alt="" />
            </span>
            <div className="ca-content">
              <h2 className="ca-main">测温数据</h2>
              <h3 className="ca-sub">小字说明文字</h3>
            </div>
          </Link>
        </li>
        <li>
          <Link to="/flowData">
            <span className="ca-icon">
              <img src={icon4} alt="" />
            </span>
            <div className="ca-content">
              <h2 className="ca-main">流量数据</h2>
              <h3 className="ca-sub">小字说明文字</h3>
            </div>
          </Link>
        </li>
        <li>
          <Link to="/thermalEffect">
            <span className="ca-icon">
              <img src={icon3} alt="" />
            </span>
            <div className="ca-content">
              <h2 className="ca-main">热效应</h2>
              <h3 className="ca-sub">小字说明文字</h3>
            </div>
          </Link>
        </li>
        {currentUser?.isAdmin && (
          <li>
            <Link to="/settings/user">
              <span className="ca-icon">
                <SettingOutlined />
              </span>
              <div className="ca-content">
                <h2 className="ca-main">系统设置</h2>
                <h3 className="ca-sub">小字说明文字</h3>
              </div>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default MainMenu;
