import { useDebounceFn } from "@ant-design/pro-utils";
import { Avatar, ConfigProvider } from "antd";
import React, { useContext, useMemo, useState } from "react";
import type { GlobalHeaderProps } from ".";
/**
 * 抽离出来是为了防止 rightSize 经常改变导致菜单 render
 *
 * @param param0
 */
export const ActionsContent: React.FC<GlobalHeaderProps> = ({
  rightContentRender,
  avatarProps,
  actionsRender,
  headerContentRender,
  ...props
}) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = `${getPrefixCls()}-pro-global-header`;

  const [rightSize, setRightSize] = useState<number | string>("auto");

  const avatarDom = useMemo(() => {
    if (!avatarProps) return null;
    const { title, render, ...rest } = avatarProps;
    const domList = [
      rest?.src || rest?.srcSet || rest.icon || rest.children ? (
        <Avatar {...rest} size={28} key="avatar" />
      ) : null,
      title ? (
        <span
          key="name"
          style={{
            marginInlineStart: 8,
          }}
        >
          {title}
        </span>
      ) : undefined,
    ];

    if (render) {
      return render(avatarProps, <div>{domList}</div>);
    }
    return <div>{domList}</div>;
  }, [avatarProps]);

  /** 减少一下渲染的次数 */
  const setRightSizeDebounceFn = useDebounceFn(async (width: number) => {
    setRightSize(width);
  }, 160);

  const contentRender = rightContentRender;
  return (
    <div
      className={`${prefixCls}-right-content`.trim()}
      style={{
        minWidth: rightSize,
        height: "100%",
      }}
    >
      用户名
    </div>
  );
};
