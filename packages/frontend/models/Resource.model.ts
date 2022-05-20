import { RichTextContent } from '@graphcms/rich-text-types'

export class Resource {
  constructor(
    public id: string,
    public title: string,
    public slug: string,
    public content: RichTextContent | undefined,
  ) { }

  static fromObject(data: any): Resource | null {
    if (!data) return null

    return new Resource(
      data?.['id'] as string,
      data?.['title'] as string,
      data?.['slug'] as string,
      data?.['content']?.raw as RichTextContent,
    )
  }
}