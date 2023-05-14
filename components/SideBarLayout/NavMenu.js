import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import appPath from '@/constant/appPath';

import { admin, teacher, student } from './navItem';
import { handleBarTitle } from '@/utils/appHelper';
import { fetchAuth } from '@/store/actions';
import { getUserAuthToken } from '@/utils/authHelper';

export function NavMenu({ setBarTitle }) {
  const { role } = useSelector(({ common }) => common);
  const dispatch = useDispatch();
  const router = useRouter();
  const { asPath } = router;

  const [selectedMenu, setSelectedMenu] = useState('/');
  const [navItems, setNavItems] = useState([]);

  useEffect(() => {
    setSelectedMenu(asPath);
  }, [asPath]);

  useEffect(() => {
    handleBarTitle(window?.location?.pathname, (title) => setBarTitle(title));
  }, [window?.location?.pathname]);

  useEffect(() => {
    if (role) {
      if (role === 'admin') {
        setNavItems(admin);
      } else if (role === 'teacher') {
        setNavItems(teacher);
      } else if (role === 'student') {
        setNavItems(student);
      }
    } else {
      dispatch(fetchAuth());
    }
  }, [role]);

  return (
    <Menu
      style={{ background: 'transparent', color: 'white' }}
      mode="inline"
      defaultSelectedKeys={['/']}
      selectedKeys={selectedMenu}
      items={navItems.map((item) => ({
        key: item.path,
        label: item.title,
        children: item?.children?.map((el) => ({
          key: el.path,
          label: el.title,
        })),
      }))}
      onClick={({ key }) => {
        // handleBarTitle(key, (title) => setBarTitle(title));
        setSelectedMenu(key);
        router.push(key);
      }}
    />
  );
}
