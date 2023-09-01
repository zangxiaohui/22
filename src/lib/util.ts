import { message } from "antd";
import qs from "qs";

function actionByQueryParam(
  param: string,
  getMessage: (paramValue?: string) => string,
  waitMillis: number = 3000,
  action: (paramValue?: string) => void
): Promise<void> {
  return new Promise<void>((resolve) => {
    const paramValue: any = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    })[param];

    message.success(getMessage(paramValue), waitMillis / 1000);
    setTimeout(() => {
      action(paramValue);
      resolve();
    }, waitMillis);
  });
}

export function redirectByQueryParam(
  param: string,
  redirectMessage: string,
  nonRedirectMessage: string,
  waitMillis: number = 3000
): Promise<void> {
  return actionByQueryParam(
    param,
    (paramValue) => (paramValue ? redirectMessage : nonRedirectMessage),
    waitMillis,
    (paramValue) => {
      if (paramValue) {
        window.location.href = paramValue;
      }
    }
  );
}

export function forwardOrRefreshByQueryParam(param: string) {
  const paramValue: any = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })[param];
  if (paramValue) {
    window.location.assign(paramValue);
  } else {
    window.location.reload();
  }
}

export function goBackByQueryParam(
  backMessage: string,
  stayMessage: string,
  param: string = "goBackSteps",
  waitMillis: number = 3000
): Promise<void> {
  const urlParams = new URL(window.location.href);
  const goBackSteps = urlParams.searchParams.get(param) || "-1";
  return actionByQueryParam(
    "back",
    (paramValue) => (paramValue === "true" ? backMessage : stayMessage),
    waitMillis,
    (paramValue) => {
      if (paramValue === "true") {
        window.history.go(parseInt(goBackSteps));
      }
    }
  );
}

export function gotoReferrerByQueryParam(
  backMessage: string,
  stayMessage: string,
  waitMillis: number = 3000
): Promise<void> {
  return actionByQueryParam(
    "back",
    (paramValue) =>
      paramValue === "true" && document.referrer ? backMessage : stayMessage,
    waitMillis,
    (paramValue) => {
      console.log(document.referrer);
      if (paramValue === "true" && document.referrer) {
        window.location.assign(document.referrer);
      }
    }
  );
}

interface WindowProps extends Window {
  wx: any;
}

declare const window: WindowProps;

export const postMessage = (data: Object): void => {
  window.wx.miniProgram.navigateBack({ delta: 2 });
  window.wx.miniProgram.postMessage({ data });
};

export function getQueryVariable(variable: string) {
  const URLObject = new URL(window.location.href);
  return URLObject.searchParams.get(variable);
}

export function gotoControllableReferrer(
  backMessage: string,
  stayMessage: string,
  referrer: any = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  }).referrer || document.referrer,
  waitMillis: number = 3000
): Promise<void> {
  return actionByQueryParam(
    "back",
    (paramValue) =>
      paramValue === "true" && referrer ? backMessage : stayMessage,
    waitMillis,
    (paramValue) => {
      if (paramValue === "true" && referrer) {
        window.location.assign(referrer);
      }
    }
  );
}
