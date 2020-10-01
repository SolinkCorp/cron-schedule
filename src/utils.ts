export const TIMEOUT_MAX = 2147483647 // 2^31-1

export interface ITimerHandle {
  timeoutId?: ReturnType<typeof setTimeout>
}

/**
 * Creates a new timeout, which can exceed the max timeout limit of 2^31-1.
 * Since multiple timeouts are used internally, the timeoutId used to clear the timeout
 * is returned as a handle (object) and changes whenever the max timeout limit is exceeded.
 * The handle parameter can be ignored, it is used internally for updating the timeoutId
 * in the handle after creating the next timeout.
 */
export function longTimeout(
  fn: () => void,
  timeout: number,
  handle?: ITimerHandle
): ITimerHandle {
  let after = 0

  if (timeout > TIMEOUT_MAX) {
    after = timeout - TIMEOUT_MAX
    timeout = TIMEOUT_MAX
  }

  handle ??= {
    timeoutId: undefined,
  }

  handle.timeoutId = setTimeout(() => {
    if (after > 0) {
      longTimeout(fn, after, handle)
    } else {
      fn()
    }
  }, timeout)

  return handle
}

/* Extracts second, minute, hour, date, month and the weekday from a date. */
export function extractDateElements(
  date: Date
): {
  second: number
  minute: number
  hour: number
  day: number
  month: number
  weekday: number
  year: number
} {
  return {
    second: date.getSeconds(),
    minute: date.getMinutes(),
    hour: date.getHours(),
    day: date.getDate(),
    month: date.getMonth(),
    weekday: date.getDay(),
    year: date.getFullYear(),
  }
}
