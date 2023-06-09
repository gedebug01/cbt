import React, { useEffect, useState, useRef } from 'react';
import { Layout, Avatar, theme, Popover, Button } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';

import { useDispatch, useSelector } from 'react-redux';

import style from './styles.module.scss';
import { useRouter } from 'next/router';
import { resetStudentLogin } from '@/store/actions';

export default function NavHeader({ barTitle }) {
  const dispatch = useDispatch();
  const { role } = useSelector(({ common }) => common);
  const { Header } = Layout;
  const [showMenu, setShowMenu] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const router = useRouter();

  const clickRef = useRef();

  const doLogOut = async () => {
    if (role === 'student') {
      const { error } = await dispatch(resetStudentLogin());
      if (!error) {
        localStorage.clear();
        router.push('/');
      }
    } else {
      localStorage.clear();
      router.push('/');
    }
  };

  const content = (
    <div className={style.popoverItem}>
      <div className={style.headerItemList}>
        <Button danger type="text" onClick={doLogOut}>
          <LogoutOutlined />
          <p>Log Out</p>
        </Button>
      </div>
    </div>
  );

  useEffect(() => {
    document.addEventListener(
      'click',
      (e) => {
        if (!clickRef?.current?.contains(e.target)) setShowMenu(false);
      },
      true
    );
  }, []);

  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer,
      }}
    >
      <div className={style.headerContainer}>
        <div className={style.titleContainer}>
          <p className={style.barTitle}>{barTitle}</p>
        </div>
        <div className={style.avatarContainer}>
          <Popover placement="rightBottom" content={content} trigger="click">
            <Avatar
              shape="square"
              size="large"
              icon={<UserOutlined />}
              onClick={() => setShowMenu(!showMenu)}
              ref={clickRef}
            />
          </Popover>
        </div>
      </div>
    </Header>
  );
}
