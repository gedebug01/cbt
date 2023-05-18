import LS_KEYS from '@/constant/localStorage';
import { Button, Divider, Radio, Space } from 'antd';
import React from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';

export const ExamContent = ({
  qustionTotal,
  onValueChange,
  // value,
  onExamFinish,
  isOld,
}) => {
  const [value, setValue] = useState({});

  useEffect(() => {
    if (onValueChange) {
      onValueChange(value);
    }
  }, [value]);

  const setOldData = () => {
    if (typeof window !== undefined) {
      const oldAnswer = localStorage.getItem(LS_KEYS.STUDENT_EXAM_ANSWER);
      setValue(JSON.parse(oldAnswer) ?? {});
    }
  };

  useEffect(() => {
    if (isOld) {
      setOldData();
    }
  }, [isOld]);

  const onChange = useCallback((e, number) => {
    setValue((prevState) => {
      const newValue = { ...prevState };
      newValue[number] = e.target.value;
      if (typeof window !== undefined) {
        localStorage.setItem(
          LS_KEYS.STUDENT_EXAM_ANSWER,
          JSON.stringify(newValue)
        );
      }
      return newValue;
    });
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {qustionTotal
        ? qustionTotal?.map((_, idx) => (
            <React.Fragment key={idx}>
              <Space direction="horizontal" style={{ marginBottom: 10 }}>
                <p>{idx + 1}. </p>
                <Radio.Group
                  onChange={(e) => onChange(e, idx + 1)}
                  value={value[idx + 1]}
                >
                  <Radio value={'a'}>A</Radio>
                  <Radio value={'b'}>B</Radio>
                  <Radio value={'c'}>C</Radio>
                  <Radio value={'d'}>D</Radio>
                </Radio.Group>
              </Space>
              <Divider
                style={{
                  marginTop: 5,
                  marginBottom: 10,
                }}
              />
            </React.Fragment>
          ))
        : null}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          type="primary"
          style={{ marginTop: 20 }}
          onClick={() => onExamFinish(value)}
        >
          Kumpul
        </Button>
      </div>
    </div>
  );
};
