import { CopyrightCircleOutlined } from "@ant-design/icons";
import type { WithFalse } from "../../utils/typings";
import styles from "./index.module.scss";

export type HeaderViewProps = GlobalHeaderProps & {
  isMobile?: boolean;
  logo?: React.ReactNode;
  headerRender?: WithFalse<
    (props: HeaderViewProps, defaultDom: React.ReactNode) => React.ReactNode
  >;
  headerTitleRender?: WithFalse<
    (
      logo: React.ReactNode,
      title: React.ReactNode,
      props: HeaderViewProps
    ) => React.ReactNode
  >;
  headerContentRender?: WithFalse<
    (props: HeaderViewProps, defaultDom: React.ReactNode) => React.ReactNode
  >;
  siderWidth?: number;
  hasSiderMenu?: boolean;
};

const GlobalFooter: React.FC = () => {
  return (
    <div className={styles.footer}>
      <CopyrightCircleOutlined /> xxxx~{new Date().getFullYear()}{" "}
    </div>
  );
};

export default GlobalFooter;
