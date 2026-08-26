export interface CalculateTimeOptions {
    day?: number;
    hour?: number;
    minute?: number;
    second?: number;
    millisecond?: number;
}

const MILLISECOND_PER_SECOND = 1000;
const SECOND_PER_MINUTE = 60;
const MINUTE_PER_HOUR = 60;
const HOUR_PER_DAY = 24;

export const calculateTime = ({
    day,
    hour,
    minute,
    second,
    millisecond,
}: CalculateTimeOptions): number => {
    const toDay = (day ?? 0) * HOUR_PER_DAY * MINUTE_PER_HOUR * SECOND_PER_MINUTE;
    const toHour = (hour ?? 0) * MINUTE_PER_HOUR * SECOND_PER_MINUTE;
    const toMinute = (minute ?? 0) * SECOND_PER_MINUTE;
    const toSecond = (second ?? 0);
    const toMilliseconds = millisecond ?? 0;

    const totalTime = ((toDay + toHour + toMinute + toSecond) * MILLISECOND_PER_SECOND) + toMilliseconds;

    return totalTime;
}