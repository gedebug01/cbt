import React, { useEffect, useState } from 'react';
import { Button, notification, Form, Input, Radio, Spin } from 'antd';

import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

import { fetchLogin, fetchAuth } from '@/store/actions';

import { DefaultLayout } from '@/components';

import style from './Login.module.scss';
import { getUserAuthToken, setUserAuthToken } from '@/utils/authHelper';

export default function Login() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [notif, contextHolder] = notification.useNotification();
  const dispatch = useDispatch();

  const onRoleTypeChange = ({ roleType }) => {
    setRoleType(roleType);
  };

  const [roleType, setRoleType] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const showNotif = (type, message, description) => {
    notif[type]({
      message: message,
      description: description,
      placement: 'topRight',
    });
  };

  const checkAuth = async (token) => {
    try {
      const { data } = await dispatch(fetchAuth(token));
      if (data?.role) {
        router.push(`/${data.role}/dashboard`);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = getUserAuthToken();
    if (token) {
      checkAuth({ token });
    } else {
      setIsLoading(false);
    }
  }, []);

  const onFinish = async (values) => {
    for (const key in values) {
      const value = values[key]?.trim();
      if (!value) {
        showNotif('error', '', `${key} is required`);
        return;
      }
    }
    const { data, error } = await dispatch(fetchLogin(values));

    if (data) {
      setUserAuthToken(data.token);
      if (data?.role) {
        router.push(`/${data.role}/dashboard`);
      }
    }

    if (error) {
      showNotif('error', 'Login failed', error);
    }
  };

  return (
    <>
      {contextHolder}
      {isLoading ? (
        <Spin />
      ) : (
        <DefaultLayout>
          <div className={style.wrapper}>
            <div className={style.box}>
              <div className={style.container}>
                <div className={style.rightContainer}>Selamat Datang</div>
                <div className={style.leftContainer}>
                  <Form
                    onFinish={onFinish}
                    form={form}
                    layout="vertical"
                    initialValues={{
                      requiredMarkValue: roleType,
                    }}
                    onValuesChange={onRoleTypeChange}
                  >
                    <Form.Item label="Username" name="username">
                      <Input placeholder="username" />
                    </Form.Item>
                    <Form.Item label="Password" name="password">
                      <Input.Password placeholder="password" />
                    </Form.Item>
                    <Form.Item label="Pilih Role" name="role">
                      <Radio.Group>
                        <Radio.Button value="admin">Admin</Radio.Button>
                        <Radio.Button value="guru">Guru</Radio.Button>
                        <Radio.Button value="siswa">Siswa</Radio.Button>
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Login
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </DefaultLayout>
      )}
    </>
  );
}
