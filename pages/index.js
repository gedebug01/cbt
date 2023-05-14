import React, { useEffect, useState } from 'react';
import {
  Button,
  notification,
  Form,
  Input,
  Radio,
  Spin,
  Card,
  Space,
  Image,
  Row,
} from 'antd';

import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

import { DefaultLayout } from '@/components';

import { fetchLogin, fetchAuth } from '@/store/actions';
import { getUserAuthToken, setUserAuthToken } from '@/utils/authHelper';
import http from '@/api/http';

import style from './Login.module.scss';

export default function Login() {
  const router = useRouter();
  const [notif, contextHolder] = notification.useNotification();
  const dispatch = useDispatch();

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
        http.refreshToken();
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
        http.setAuthTokenHeader(data.token);
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
        <div className={style.spinnerContainer}>
          <Spin size="large" />
        </div>
      ) : (
        <DefaultLayout>
          <div className={style.wrapper}>
            <Card className={style.box}>
              <Row align="middle" justify="center" style={{ marginBottom: 20 }}>
                <Image
                  alt="logo"
                  src="https://elearning.mipesrikdi.sch.id/__statics/upload/logo1656311603.png"
                  width={100}
                />
              </Row>
              <Form
                name="normal_login"
                initialValues={{ remember: true }}
                onFinish={onFinish}
              >
                <Space size={20} direction="vertical">
                  <Form.Item
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your Username!',
                      },
                    ]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Username" />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your Password!',
                      },
                    ]}
                  >
                    <Input
                      prefix={<LockOutlined />}
                      type="password"
                      placeholder="Password"
                    />
                  </Form.Item>
                  <Form.Item name="role">
                    <Radio.Group>
                      <Radio.Button value="admin">Admin</Radio.Button>
                      <Radio.Button value="teacher">Guru</Radio.Button>
                      <Radio.Button value="student">Siswa</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className={style.loginFormBtn}
                    >
                      Log in
                    </Button>
                  </Form.Item>
                </Space>
              </Form>
            </Card>
          </div>
        </DefaultLayout>
      )}
    </>
  );
}
