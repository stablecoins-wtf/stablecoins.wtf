import { RichTextContent } from '@graphcms/rich-text-types'

export class Article {
  constructor(
    public id: string,
    public createdAt: Date,
    public updatedAt: Date,
    public title: string,
    public subtitle: string,
    public slug: string,
    public content: RichTextContent | undefined,
    public tags: string[],
  ) {}

  static fromObject(data: any): Article | null {
    if (!data) return null

    return new Article(
      data?.['id'] as string,
      new Date(data?.['createdAt']),
      new Date(data?.['updatedAt']),
      data?.['title'] as string,
      data?.['subtitle'] as string,
      data?.['slug'] as string,
      data?.['content']?.raw as RichTextContent,
      data?.['tags'] as string[],
    )
  }

  getRelativeUrl(): string {
    return `/articles/${this.slug}`
  }
}
