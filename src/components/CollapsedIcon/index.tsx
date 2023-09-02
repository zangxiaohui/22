import classNames from "classnames";
import { ArrowSvgIcon } from "../SiderMenu/Arrow";

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
      <ArrowSvgIcon />
    </div>
  );
};
