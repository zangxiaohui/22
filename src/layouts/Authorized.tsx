import React, { ReactElement } from "react";
import { getAuthority } from "../utils/authority";

export interface AuthorizedPageProps {}

export const AuthorizedPage: React.FC<AuthorizedPageProps> = (props) => {
  const { children } = props;
  const isLogin = getAuthority();

  return children as ReactElement;
};
