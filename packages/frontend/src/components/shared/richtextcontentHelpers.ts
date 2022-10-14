import { RichTextContent } from '@graphcms/rich-text-types'

/**
 * Sanitize RichTextContent coming from CMS including:
 *  - Remove empty paragraphs as last childs
 */
export const sanitizeRichTextContent = (content: RichTextContent | undefined): RichTextContent => {
  if (!content) return { children: [] }

  let children = Array.isArray(content) ? content : content.children
  if (!children?.length) return { children: [] }

  // Check for empty paragraph as last child
  const lastChildren = children[children.length - 1]
  const hasEmptyLastParagraph =
    lastChildren.type === 'paragraph' &&
    lastChildren.children?.length === 1 &&
    !lastChildren.children[lastChildren.children.length - 1].text
  if (hasEmptyLastParagraph) children = children.slice(0, -1)

  return { children }
}
