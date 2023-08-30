import React from "react";
import { ProfileOutlined, FundOutlined, DotChartOutlined, DashboardOutlined, SettingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import classNames from "classnames";
import styles from "./index.module.scss"
import "./index.scss"

interface MainMenuProps {
  mode: 'horizontal' | 'inline';
}
const MainMenu: React.FC<MainMenuProps> = (props) => {
  const { mode } = props;
  return (
    <div className={classNames(styles.menuWrap, {
      [styles.horizontal]: mode === 'horizontal',
      [styles.inline]: mode === 'inline',
    })}>
      <div className={styles.menu}>


        <ul className="ca-menu">
          <li>
            <a href="#">
              <span className="ca-icon">F</span>
              <div className="ca-content">
                <h2 className="ca-main">Exceptional Service</h2>
                <h3 className="ca-sub">Personalized to your needs</h3>
              </div>
            </a>
          </li>
        </ul>

        <Link to="/thermalPic" >
          <div className={classNames(styles.item, styles.item1)}>
            <span className={styles.icon}><ProfileOutlined /></span>
            测温图纸
          </div>
        </Link>
        <Link to="/thermalData" >
          <div className={classNames(styles.item, styles.item1)}>
            <span className={styles.icon}><FundOutlined /></span>
            测温数据
          </div>
        </Link>
        <Link to="/flowData" >
          <div className={classNames(styles.item, styles.item1)}>
            <span className={styles.icon}><DotChartOutlined /></span>
            流量数据
          </div>
        </Link>
        <Link to="/thermalEffect" >
          <div className={classNames(styles.item, styles.item1)}>
            <span className={styles.icon}><DashboardOutlined /></span>
            热效应
          </div>
        </Link>
        <Link to="/settings/user" >
          <div className={classNames(styles.item, styles.item1)}>
            <span className={styles.icon}><SettingOutlined /></span>
            系统设置
          </div>
        </Link>
        {mode === 'horizontal' && <div className={styles.item} />}
      </div>


    </div>
  )
};

export default MainMenu;
