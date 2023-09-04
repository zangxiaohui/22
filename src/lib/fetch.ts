export async function fetch<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const openid = localStorage.getItem("baichuan_openid");
  const curtoken = localStorage.getItem("baichuan_curtoken");
  const compoundInit: RequestInit = {
    credentials: "include",
    ...init,
  };

  if (compoundInit.headers instanceof Headers) {
    if (!compoundInit.headers.has("Accept")) {
      compoundInit.headers.set("Accept", "application/json");
    }
    if (!compoundInit.headers.has("Content-Type") && init?.body) {
      compoundInit.headers.set(
        "Content-Type",
        "application/json;charset=UTF-8"
      );
    }
    if (openid) {
      compoundInit.headers.set("openid", openid);
    }
    if (curtoken) {
      compoundInit.headers.set("curtoken", curtoken);
    }
  } else {
    const defaultHeaders: { [key: string]: string } = {
      Accept: "application/json",
      curtoken,
      openid,
    };
    if (init?.body) {
      defaultHeaders["Content-Type"] = "application/json;charset=UTF-8";
    }
    compoundInit.headers = {
      ...defaultHeaders,
      ...compoundInit.headers,
    };
  }
  const response = await window.fetch(input, compoundInit);
  const text = await response.text();
  let body: any = undefined;
  if (text) {
    body = JSON.parse(text);
  }
  if (!response.ok) {
    throw new ResponseCodeError(
      response.status,
      body?.errorType,
      body?.errorMessage,
      body
    );
  }
  return body;
}

export class ResponseCodeError extends Error {
  readonly status: number;
  readonly errorType?: string;
  readonly errorMessage?: string;
  readonly body?: any;

  constructor(
    status: number,
    errorType?: string,
    errorMessage?: string,
    body?: any
  ) {
    super();
    this.status = status;
    this.errorType = errorType;
    this.errorMessage = errorMessage;
    this.body = body;
  }

  static getMessage(err: any): string | undefined;
  static getMessage(err: any, defaultMessage: string): string;
  static getMessage(err: any, defaultMessage?: string): string | undefined {
    return (
      (err instanceof ResponseCodeError && err.errorMessage) || defaultMessage
    );
  }
}
