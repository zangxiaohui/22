import { message } from "antd";
import { useState } from "react";
import { ResponseCodeError } from "../../lib/fetch";
import { sendLoginSMSToken, sendSMSToken } from "../../services/login";

export interface UseSMSTokenResult {
  canSendSMS: boolean;
  sendSMS: () => void;
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

  const sendSMS = async (): Promise<void> => {
    if (!cellphone || !canSendSMS) {
      return;
    }
    setSmsSending(true);
    try {
      const res = await sendSMSToken(cellphone);
      startCountdown(res.limit);
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

export function useLoginSMSToken(): UseSMSTokenResult {
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

  const sendSMS = async (): Promise<void> => {
    if (!cellphone || !canSendSMS) {
      return;
    }
    setSmsSending(true);
    try {
      const res = await sendLoginSMSToken(cellphone);
      startCountdown(res.limit);
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
