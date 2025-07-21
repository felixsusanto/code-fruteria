import { merge, fromEvent, throttle, timer, switchMap } from "rxjs";
import { intervalToDuration } from "date-fns";

export const formatMinutesToHoursMinutes = (minutes: number): string => {
  const duration = intervalToDuration({
    start: 0,
    end: minutes * 60 * 1000,
  });
  const parts = [];
  if (duration.days) parts.push(`${duration.days}d`);
  if (duration.hours) parts.push(`${duration.hours}h`);
  if (duration.minutes) parts.push(`${duration.minutes}m`);
  if (parts.length === 0) return "just now";
  return parts.join(" ");
}
export const idleDetection$ = (timerValue = 60_000 * 5) => {
  const activityEvents = merge(
    fromEvent(document, "mousemove"),
    fromEvent(document, "keydown"),
    fromEvent(document, "click"),
    fromEvent(document, "scroll")
  );
  const throttleDuration = 1000; // 1 second
  const idle$ = activityEvents.pipe(
    throttle(() => timer(throttleDuration)),
    switchMap(() => timer(timerValue))
  );
  return idle$;
};
