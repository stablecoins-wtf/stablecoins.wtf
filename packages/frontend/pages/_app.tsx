import { cache } from '@emotion/css'
import { CacheProvider } from '@emotion/react'
import { DefaultSeo } from 'next-seo'
import { ThemeProvider } from 'next-themes'
import { AppProps } from 'next/app'
import Head from 'next/head'
import Router from 'next/router'
import NProgress from 'nprogress'
import Favicon from 'react-favicon'
import { env } from 'shared/environment'
import { Layout } from '../components/layout/Layout'
import GlobalStyles from '../styles/GlobalStyles'


// Router Loading Animation with @tanem/react-nprogress
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())


const App = ({ Component, pageProps }: AppProps) => (
  <>
    <DefaultSeo
      dangerouslySetAllPagesToNoFollow={!env.isProduction}
      dangerouslySetAllPagesToNoIndex={!env.isProduction}
      defaultTitle='stablecoins.wtf'
      description='For all stablecoin degens'
      openGraph={{
        type: 'website',
        locale: 'en',
        url: 'https://stablecoins.wtf',
        site_name: 'stablecoins.wtf',
      }}
      twitter={{
        handle: '@stablecoins_wtf',
      }}
    />

    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />

      {/* Favicon */}
      {/* <link rel="icon" type="image/png" sizes="32x32" href="/favicons/still/favicon-32x32.png" /> */}
      {/* <link rel="icon" type="image/png" sizes="16x16" href="/favicons/still/favicon-16x16.png" /> */}
      {/* <link rel="shortcut icon" href="/favicons/still/favicon.ico" /> */}
      <link rel="apple-touch-icon" sizes="180x180" href="/favicons/still/apple-touch-icon.png" />
      <link rel="mask-icon" href="/favicons/still/safari-pinned-tab.svg" color="#eaa929" />
      <link rel="manifest" href="/favicons/still/site.webmanifest" />
      <meta name="msapplication-TileColor" content="#2b5797" />
      <meta name="msapplication-config" content="/favicons/still/browserconfig.xml" />
      <meta name="theme-color" content="#000000" />
    </Head>

    {/* Animated Favicon */}
    <Favicon animated={true} iconSize={64} animationDelay={300}
      url={['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13'].map(idx => `/favicons/animated/coin-${idx}.ico`)} />

    <CacheProvider value={cache}>
      <GlobalStyles />

      <ThemeProvider defaultTheme="dark" attribute="class">
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </CacheProvider>
  </>
)

export default App
