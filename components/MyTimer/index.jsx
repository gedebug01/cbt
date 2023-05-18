import { ClockCircleOutlined } from '@ant-design/icons';
import { Button, Space, Tag } from 'antd';
import React, { useEffect } from 'react';
import { useTimer } from 'react-timer-hook';

import style from './styles.module.scss';
import LS_KEYS from '@/constant/localStorage';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useState } from 'react';

export function MyTimer({ duration, onFinish, allowCollect, isOld }) {
  const [expiryTimestamp, setExpiryTimestamp] = useLocalStorage(
    LS_KEYS.STUDENT_EXAM_DURATION,
    null
  );
  const [onEnd, setOnEnd] = useState(false);

  const { seconds, minutes, hours, restart, pause, start } = useTimer({
    expiryTimestamp,
    onExpire: () => setOnEnd((prevState) => !prevState),
  });

  useEffect(() => {
    if (isOld) {
      if (typeof window !== undefined) {
        const interval = localStorage.getItem(LS_KEYS.STUDENT_EXAM_DURATION);
        setExpiryTimestamp(Number(interval));
        restart(Number(interval));
      }
    } else {
      if (duration) {
        const time = new Date();
        const interval = time.setSeconds(time.getSeconds() + duration * 60);
        setExpiryTimestamp(interval);
        restart(interval);
      }
    }
  }, [isOld, duration]);

  useEffect(() => {
    if (minutes) {
      if (minutes < 15) {
        allowCollect(true);
      }
    }
  }, [minutes]);

  useEffect(() => {
    if (onEnd) {
      onFinish();
    }
  }, [onEnd]);

  return expiryTimestamp ? (
    <>
      {/* <Button onClick={pause}>pause</Button>
      <Button onClick={start}>start</Button> */}
      {!onEnd ? (
        <Tag
          className={style.timer}
          color="processing"
          icon={<ClockCircleOutlined />}
        >
          <p
            className={style.title}
          >{`Waktu: ${hours} : ${minutes} : ${seconds}`}</p>
        </Tag>
      ) : (
        <Tag
          className={style.timer}
          color="error"
          icon={<ClockCircleOutlined />}
        >
          <div className={style.content}>
            <p>Closed</p>
          </div>
        </Tag>
      )}
    </>
  ) : null;
}
