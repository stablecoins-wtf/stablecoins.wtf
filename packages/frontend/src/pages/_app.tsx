import { cache } from '@emotion/css'
import { CacheProvider } from '@emotion/react'
import { env } from '@shared/environment'
import { DefaultSeo } from 'next-seo'
import { ThemeProvider } from 'next-themes'
import { AppProps } from 'next/app'
import Head from 'next/head'
import Router from 'next/router'
import NProgress from 'nprogress'
import Favicon from 'react-favicon'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from 'react-query'
import { theme } from 'twin.macro'
import { Layout } from '../components/layout/Layout'
import GlobalStyles from '../styles/GlobalStyles'

// Router Loading Animation with @tanem/react-nprogress
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

// Create a client for React Query
const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
        dangerouslySetAllPagesToNoFollow={!env.isProduction}
        dangerouslySetAllPagesToNoIndex={!env.isProduction}
        defaultTitle="stablecoins.wtf – Crypto Stablecoin Dashboard & Resources"
        titleTemplate="%s | stablecoins.wtf – Crypto Stablecoin Dashboard"
        description="Track live market data of crypto stablecoins pegged to USD & EUR. Learn about mechanisms: algorithmic, crypto-backed, and fiat-backed."
        openGraph={{
          type: 'website',
          locale: 'en',
          url: 'https://stablecoins.wtf',
          site_name: 'stablecoins.wtf',
          images: [
            {
              url: `${env.url}/og/cover.jpg`,
              width: 1200,
              height: 670,
            },
          ],
        }}
        twitter={{
          handle: '@stablecoinswtf',
          site: '@stablecoinswtf',
          cardType: 'summary_large_image',
        }}
      />

      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        {/* Plausible Analytics */}
        {env.isProduction && (
          <script
            defer
            data-domain="stablecoins.wtf"
            src="https://plausible.io/js/plausible.js"
          ></script>
        )}

        {/* Favicon */}
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/still/apple-touch-icon.png" />
        <link rel="mask-icon" href="/favicons/still/safari-pinned-tab.svg" color="#eaa929" />
        <meta name="msapplication-TileColor" content="#2b5797" />
        <meta name="msapplication-config" content="/favicons/still/browserconfig.xml" />
        <meta name="theme-color" content="#000000" />
      </Head>

      {/* Animated Favicon */}
      <Favicon
        animated={true}
        iconSize={64}
        animationDelay={250}
        url={['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13'].map(
          (idx) => `/favicons/animated/coin-${idx}.ico`,
        )}
      />

      <CacheProvider value={cache}>
        <GlobalStyles />

        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            themes={['dark']}
            defaultTheme="dark"
            attribute="class"
            enableColorScheme={false}
          >
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ThemeProvider>
        </QueryClientProvider>

        <Toaster
          toastOptions={{
            position: 'top-center',
            style: {
              wordBreak: 'break-all',
              maxWidth: '30rem',
              background: theme('colors.black'),
              color: theme('colors.white'),
              fontWeight: 'semibold',
              borderRadius: '0px',
              border: `1px ${theme('colors.bbg.gray3')} solid`,
            },
            success: {
              duration: 5000,
            },
          }}
        />
      </CacheProvider>
    </>
  )
}
