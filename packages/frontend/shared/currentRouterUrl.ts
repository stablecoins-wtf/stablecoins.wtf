import { NextRouter } from 'next/router'
import { UrlObject } from 'url'

export const currentRouterUrl = (router: NextRouter, withObject?: Partial<UrlObject>): UrlObject => {
  return {
    pathname: router.pathname,
    query: router.query,
    ...withObject
  }
}