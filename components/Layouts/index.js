import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { Heading } from '../Head';
import style from '@/styles/Layout.module.css';
import { getUserAuthToken } from '@/utils/authHelper';

export function DefaultLayout({ children, title }) {
  const router = useRouter();

  useEffect(() => {
    const token = getUserAuthToken();

    if (!token) {
      router.push('/');
    }
  }, []);

  return (
    <>
      <Heading title={title} />
      <div className={style.wrapper}>{children}</div>
    </>
  );
}
