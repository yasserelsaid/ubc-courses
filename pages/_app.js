import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../assets/theme';
import Layout from '../components/layout';
import { v4 as uuidv4 } from 'uuid';
import cookie from 'js-cookie';
import * as gtag from '../lib/gtag';
import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import '../assets/css/nprogress.css';
import '../assets/css/utils.css';
import { DefaultSeo } from 'next-seo';
import SEO from '../next-seo.config';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = url => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }

    // device id
    const deviceId = cookie.get('deviceId');
    if (!deviceId) {
      cookie.set('deviceId', uuidv4(), {
        expires: 365,
      });
    }
  }, []);

  return (
    <React.Fragment>
      <DefaultSeo {...SEO} />
      <Head>
        <title>UBC Courses</title>
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width'
        />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
