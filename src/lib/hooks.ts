import { message } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { ResponseCodeError } from "./fetch";

/**
 * useAsync
 */
export function useAsync<T>(action: () => Promise<T>): T | undefined;
export function useAsync<T>(
  action: () => Promise<T>,
  defaultValue: T,
  errorHandler?: (err: any) => void
): T;
export function useAsync<T>(
  action: () => Promise<T>,
  defaultValue?: T,
  errorHandler?: (err: any) => void
): T | undefined {
  const [value, setValue] = useState<T>(defaultValue as T);
  useEffect(() => {
    action()
      .then((val) => setValue(val))
      .catch(errorHandler || console.error);
  }, [action, errorHandler]);
  return value;
}

/**
 * useSubmission
 */
interface AsyncSubmission<T> {
  (): Promise<T>;
}

type SubmissionWrapper = <T>(
  submitFunc: AsyncSubmission<T>
) => Promise<T | undefined>;

export function useSubmission(
  defaultMessage: string = "请求失败，请稍后重试"
): [SubmissionWrapper, boolean] {
  const [submitting, setSubmitting] = useState(false);
  const doSubmit: SubmissionWrapper = async (submitFunc) => {
    if (submitting) {
      return;
    }
    setSubmitting(true);
    try {
      return await submitFunc();
    } catch (e) {
      message.error(ResponseCodeError.getMessage(e, defaultMessage));
    } finally {
      setSubmitting(false);
    }
  };

  return [doSubmit, submitting];
}

export function useBeforeUnload(alert: boolean): void {
  useEffect(() => {
    const callback = (e: BeforeUnloadEvent) => {
      if (alert) {
        e.returnValue = "系统可能不会保存您所做的更改";
      }
    };
    window.addEventListener("beforeunload", callback);
    return () => {
      window.removeEventListener("beforeunload", callback);
    };
  }, [alert]);
}

type Task = () => void;
type SchedulerFunc = (callback: Task, timeMs: number) => void;
interface UseSingletonTimeoutResult {
  cancel: Task;
  hasSchedule: () => boolean;
  schedule: SchedulerFunc;
  scheduleIfIdle: SchedulerFunc;
}

export function useSingletonTimeout(): UseSingletonTimeoutResult {
  const handleRef = useRef<number>();
  return useMemo(() => {
    const cancel = () => {
      if (handleRef.current !== undefined) {
        window.clearTimeout(handleRef.current);
        handleRef.current = undefined;
      }
    };

    return {
      hasSchedule: () => handleRef.current !== undefined,

      schedule(callback: Task, timeMs: number) {
        cancel();
        handleRef.current = window.setTimeout(() => {
          handleRef.current = undefined;
          callback();
        }, timeMs);
      },

      scheduleIfIdle(callback: Task, timeMs: number) {
        if (handleRef.current !== undefined) {
          return;
        }
        handleRef.current = window.setTimeout(() => {
          handleRef.current = undefined;
          callback();
        }, timeMs);
      },

      cancel,
    };
  }, []);
}

export enum AuthState {
  // 初始，检查请求还未返回
  INITIAL,
  // 初始状态即已经登录
  INITIAL_AUTHED,
  // 初始状态即未登录
  INITIAL_UNAUTHED,
  // 状态从登录变为未登录
  TRANSIT_AUTHED,
  // 状态从未登录变为登录
  TRANSIT_UNAUTHED,
}
