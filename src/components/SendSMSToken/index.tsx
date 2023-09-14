import { message } from "antd";
import { useState } from "react";
import { ResponseCodeError } from "../../lib/fetch";
import { sendRegisterSMSCode } from "../../services/login";

export interface UseSMSTokenResult {
  canSendSMS: boolean;
  sendSMS: (values: any) => void;
  smsSending: boolean;
  smsCoolDown: number;
  setCellphone: (value: string) => void;
}

export function useSMSToken(): UseSMSTokenResult {
  const [cellphone, setCellphone] = useState<string>();
  const [smsCoolDown, setSmsCoolDown] = useState(0);
  const [smsSending, setSmsSending] = useState(false);

  const canSendSMS = Boolean(cellphone && !smsSending && smsCoolDown === 0);

  const startCountdown = (time: number) => {
    setSmsCoolDown(time);
    const interval = setInterval(() => {
      setSmsCoolDown((c) => {
        if (c > 0) {
          return c - 1;
        } else {
          clearInterval(interval);
          return 0;
        }
      });
    }, 1000);
  };

  const sendSMS = async (values: any): Promise<Boolean> => {
    const { uid, ValidCode } = values;
    if (!cellphone || !canSendSMS || !uid || !ValidCode) {
      return false;
    }
    setSmsSending(true);
    try {
      const res = await sendRegisterSMSCode({
        phone: cellphone,
        uid,
        ValidCode,
      });
      if (res?.state) {
        // startCountdown(res.limit);
        startCountdown(60);
      } else {
        message.error(res?.msg);
      }
      return res?.state;
    } catch (e) {
      message.error(
        ResponseCodeError.getMessage(e, "发送验证码失败，请稍后重试")
      );
      return false;
    } finally {
      setSmsSending(false);
    }
  };

  return {
    canSendSMS,
    sendSMS,
    smsSending,
    smsCoolDown,
    setCellphone,
  };
}

export function useRegisterSMSToken(): UseSMSTokenResult {
  const [cellphone, setCellphone] = useState<string>();
  const [smsCoolDown, setSmsCoolDown] = useState(0);
  const [smsSending, setSmsSending] = useState(false);

  const canSendSMS = Boolean(cellphone && !smsSending && smsCoolDown === 0);

  const startCountdown = (time: number) => {
    setSmsCoolDown(time);
    const interval = setInterval(() => {
      setSmsCoolDown((c) => {
        if (c > 0) {
          return c - 1;
        } else {
          clearInterval(interval);
          return 0;
        }
      });
    }, 1000);
  };

  const sendSMS = async (values: any): Promise<void> => {
    const { uid, ValidCode } = values;
    if (!cellphone || !canSendSMS || !uid || !ValidCode) {
      return;
    }
    setSmsSending(true);
    try {
      const res = await sendRegisterSMSCode({
        phone: cellphone,
        uid,
        ValidCode,
      });
      if (res?.state) {
        // startCountdown(res.limit);
        startCountdown(60);
      } else {
        message.error(res?.msg);
      }
    } catch (e) {
      message.error(
        ResponseCodeError.getMessage(e, "发送验证码失败，请稍后重试")
      );
    } finally {
      setSmsSending(false);
    }
  };

  return {
    canSendSMS,
    sendSMS,
    smsSending,
    smsCoolDown,
    setCellphone,
  };
}
