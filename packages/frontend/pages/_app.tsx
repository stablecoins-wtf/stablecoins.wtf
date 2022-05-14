import { DefaultSeo } from 'next-seo'
import { AppProps } from 'next/app'
import Head from 'next/head'
import Router from 'next/router'
import NProgress from 'nprogress'
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
      <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
      <link rel="manifest" href="/favicons/site.webmanifest" />
      <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#eaa929" />
      <link rel="shortcut icon" href="/favicons/favicon.ico" />
      <meta name="msapplication-TileColor" content="#2b5797" />
      <meta name="msapplication-config" content="/favicons/browserconfig.xml" />
      <meta name="theme-color" content="#ffffff" />
    </Head>

    <GlobalStyles />

    <Layout>
      <Component {...pageProps} />
    </Layout>
  </>
)

export default App
