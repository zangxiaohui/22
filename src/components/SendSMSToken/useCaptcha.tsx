import { useCallback, useState } from "react";
import { serverPath } from "../../pages/Login/LoginForm";
import { getToken } from "../../services/login";

export interface UseCaptchaResult {
  uid: string;
  captchaSrc: string;
  refreshCaptcha: () => void;
}

export function useCaptcha(): UseCaptchaResult {
  const [captchaSrc, setCaptchaSrc] = useState<string>("");
  const [uid, setUid] = useState<string>("");

  const refreshCaptcha = useCallback(() => {
    getToken().then((res) => {
      const { token, uid } = res?.data;
      setUid(uid);
      setCaptchaSrc(
        `${serverPath}/webdata/user/ValidCodeImageCus.aspx?uid=${uid}&token=${token}`
      );
    });
  }, []);

  return {
    uid,
    captchaSrc,
    refreshCaptcha,
  };
}
