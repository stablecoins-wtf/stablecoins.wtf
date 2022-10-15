import { RichTextContent } from '@graphcms/rich-text-types'
import { Article } from './Article.model'

export class Resource extends Article {
  static fromObject(data: any): Resource | null {
    if (!data) return null

    return new Resource(
      data?.['id'] as string,
      !data?.['documentInStages']?.length,
      new Date(data?.['createdAt']),
      undefined,
      new Date(data?.['updatedAt']),
      data?.['title'] as string,
      data?.['subtitle'] as string,
      data?.['slug'] as string,
      data?.['content']?.raw as RichTextContent,
      (data?.['tags'] || []) as string[],
    )
  }

  getRelativeUrl(): string {
    return `/resources/${this.slug}`
  }
}
