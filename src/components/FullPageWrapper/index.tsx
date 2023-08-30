import React, {CSSProperties} from "react";
import styles from "./index.module.scss";

export interface FullPageWrapperProps {
  className?: string;
  style?: CSSProperties;
}

const FullPageWrapper: React.FC<FullPageWrapperProps> = props => {
  const {className, style, children} = props;
  return (
    <div className={styles.outer}>
      <div className={styles.inner + (className ? ` ${className}` : "")} style={style}>
        {children}
      </div>
    </div>
  );
};

export default FullPageWrapper;
