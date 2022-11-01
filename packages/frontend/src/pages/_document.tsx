import { extractCritical } from '@emotion/server'
import Document, { Head, Html, Main, NextScript } from 'next/document'
import React from 'react'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx)
    const critical = extractCritical(initialProps.html)
    initialProps.html = critical.html
    initialProps.styles = (
      <React.Fragment>
        {initialProps.styles}
        <style
          data-emotion-css={critical.ids.join(' ')}
          dangerouslySetInnerHTML={{ __html: critical.css }}
        />
      </React.Fragment>
    )
    return initialProps
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Preload Local Fonts */}
          {[
            '/fonts/inconsolata/subset-Inconsolata-Bold.woff2',
            '/fonts/inconsolata/subset-Inconsolata-Black.woff2',
            '/fonts/inconsolata/subset-Inconsolata-Regular.woff2',
            '/fonts/inconsolata/subset-Inconsolata-SemiBold.woff2',
            '/fonts/inconsolata/subset-Inconsolata-Medium.woff2',
          ].map((font) => (
            <link
              key={font}
              rel="preload"
              href={font}
              as="font"
              type="font/woff2"
              crossOrigin="anonymous"
            />
          ))}
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
