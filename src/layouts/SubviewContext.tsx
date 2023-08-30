import { createContext, useContext } from "react";

export interface SubViewContextProps {
  user?: any;
  data?: any;
  projectName?: string;
}

export const SubViewContext = createContext<SubViewContextProps>({});

export function useSelf() {
  const { user } = useContext(SubViewContext);
  return user;
}

export function useData() {
  const { data } = useContext(SubViewContext);
  return data;
}

export function useProjectName() {
  const { projectName } = useContext(SubViewContext);
  return projectName;
}
