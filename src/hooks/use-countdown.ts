import { useState, useEffect, useCallback } from 'react';

// ----------------------------------------------------------------------

type ReturnDateType = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

export function useCountdownDate(date: Date): ReturnDateType {
  const [countdown, setCountdown] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    const interval = setInterval(() => setNewTime(), 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setNewTime = () => {
    const startTime = date;

    const endTime = new Date();

    const distanceToNow = startTime.valueOf() - endTime.valueOf();

    const getDays = Math.floor(distanceToNow / (1000 * 60 * 60 * 24));

    const getHours = `0${Math.floor(
      (distanceToNow % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )}`.slice(-2);

    const getMinutes = `0${Math.floor((distanceToNow % (1000 * 60 * 60)) / (1000 * 60))}`.slice(-2);

    const getSeconds = `0${Math.floor((distanceToNow % (1000 * 60)) / 1000)}`.slice(-2);

    setCountdown({
      days: getDays.toString() || '000',
      hours: getHours || '000',
      minutes: getMinutes || '000',
      seconds: getSeconds || '000',
    });
  };

  return {
    days: countdown.days,
    hours: countdown.hours,
    minutes: countdown.minutes,
    seconds: countdown.seconds,
  };
}

// Usage
// const countdown = useCountdown(new Date('07/07/2022 21:30'));

// ----------------------------------------------------------------------

type ReturnSecondsType = {
  counting: boolean;
  countdown: number;
  startCountdown: VoidFunction;
  setCountdown: React.Dispatch<React.SetStateAction<number>>;
};

export function useCountdownSeconds(initCountdown: number): ReturnSecondsType {
  const [countdown, setCountdown] = useState(initCountdown);

  const startCountdown = useCallback(() => {
    let remainingSeconds = countdown;

    const intervalId = setInterval(() => {
      remainingSeconds -= 1;

      if (remainingSeconds === 0) {
        clearInterval(intervalId);
        setCountdown(initCountdown);
      } else {
        setCountdown(remainingSeconds);
      }
    }, 1000);
  }, [initCountdown, countdown]);

  const counting = initCountdown > countdown;

  return { counting, countdown, setCountdown, startCountdown };
}
