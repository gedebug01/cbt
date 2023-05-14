import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import { Provider } from 'react-redux';

import { wrapper } from '@/store';

import '@/styles/globals.css';
import { SideBarLayout } from '@/components';
import { getUserAuthToken } from '@/utils/authHelper';
import http from '@/api/http';

const AppRender = ({ isInLogin, isExam, Component, ...pageProps }) => {
  if (isInLogin || isExam) {
    return <Component {...pageProps} />;
  }
  return (
    <SideBarLayout>
      <Component {...pageProps} />
    </SideBarLayout>
  );
};

function App({ Component, ...rest }) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;
  const router = useRouter();
  const [isInLogin, setIsInLogin] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isExam, setIsExam] = useState(false);

  const isBrowser = typeof window !== 'undefined';

  useEffect(() => {
    if (isReady) {
      const path = window?.location?.pathname;
      if (path.length) {
        const token = getUserAuthToken();
        if (!token && path !== '/') {
          router.push('/');
        }
      }
    }
  }, [isReady]);

  useEffect(() => {
    if (isBrowser) {
      setIsReady(() => true);
      http.refreshToken();
    }
  }, [isBrowser]);

  useEffect(() => {
    if (isReady) {
      const path = router.asPath;
      if (path === '/') {
        setIsInLogin(true);
      } else if (path.includes('examPage')) {
        setIsExam(true);
      } else {
        setIsInLogin(false);
        setIsExam(false);
      }
    }
  }, [isReady, router.asPath]);

  return (
    <Provider store={store}>
      {isReady ? (
        <AppRender
          isExam={isExam}
          isInLogin={isInLogin}
          Component={Component}
          {...pageProps}
        />
      ) : null}
    </Provider>
  );
}

export default wrapper.withRedux(App);
