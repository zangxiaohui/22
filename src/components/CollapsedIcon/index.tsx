import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import classNames from "classnames";

export const CollapsedIcon: React.FC<any> = (props) => {
  const { isMobile, collapsed, ...rest } = props;

  if (isMobile && collapsed) return null;
  return (
    <div
      {...rest}
      className={classNames(props.className, {
        [`${props.className}-collapsed`]: collapsed,
        [`${props.className}-is-mobile`]: isMobile,
      })}
    >
      <div className="collapsed-icon-wrap">
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>
    </div>
  );
};
