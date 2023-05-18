import { Space, Tag } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import { ClockCircleOutlined } from '@ant-design/icons';

import style from './styles.module.scss';
import LS_KEYS from '@/constant/localStorage';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export const Timer = ({
  deadline = new Date().toString(),
  onFinish,
  allowCollect,
}) => {
  const parsedDeadline = useMemo(() => Date.parse(deadline), [deadline]);
  const [time, setTime] = useState(parsedDeadline - Date.now());
  const [onEnd, setOnEnd] = useState(false);
  // console.log('tmeL ;');
  useEffect(() => {
    const interval = setInterval(
      () => setTime(parsedDeadline - Date.now()),
      1000
    );

    return () => clearInterval(interval);
  }, [parsedDeadline]);

  useEffect(() => {
    if (Math.floor((time / MINUTE) % 60) < 15) {
      allowCollect(true);
    }

    // if (typeof window !== undefined) {
    //   localStorage.setItem(
    //     LS_KEYS.STUDENT_EXAM_DURATION,
    //     Math.floor((time / MINUTE) % 60)
    //   );
    // }
  }, [time]);

  useEffect(() => {
    if (onEnd) {
      onFinish();
    }
  }, [onEnd]);

  return (
    <>
      {!onEnd ? (
        <Tag
          className={style.timer}
          color="processing"
          icon={<ClockCircleOutlined />}
        >
          <div className={style.content}>
            <p className={style.title}>Waktu: </p>
            <Space
              size={5}
              split={<p>:</p>}
              direction="horizontal"
              align="center"
            >
              {Object.entries({
                Hours: (time / HOUR) % 24,
                Minutes: (time / MINUTE) % 60,
                Seconds: (time / SECOND) % 60,
              }).map(([label, value]) => {
                if (label === 'Minutes') {
                  if (Math.floor(value) < 0) {
                    setOnEnd((prevState) => !prevState);
                  }
                }
                return (
                  <div key={label} className="col-4">
                    <div className="box">
                      <p>{`${Math.floor(value)}`.padStart(2, '0')}</p>
                    </div>
                  </div>
                );
              })}
            </Space>
          </div>
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
  );
};
