import React from "react";

/**
 * 默认渲染logo的方式，如果是个string，用img。否则直接返回
 *
 * @param logo
 * @returns
 */
export const defaultRenderLogo = (
  logo: React.ReactNode | (() => React.ReactNode)
): React.ReactNode => {
  if (typeof logo === "string") {
    return <img width="auto" height={22} src={logo} alt="logo" />;
  }
  if (typeof logo === "function") {
    return logo();
  }
  return logo;
};
