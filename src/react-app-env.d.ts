/// <reference types="react-scripts" />
declare global {
  interface Window {
    NVC_Opt: any;
  }
}

declare module '*.webm' {
  const src: string;
  export default src;
}