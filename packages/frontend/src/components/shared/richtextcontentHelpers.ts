import { ElementNode, RichTextContent } from '@graphcms/rich-text-types'
import slugify from 'slugify'

/**
 * Sanitize given RichTextContent coming from CMS including:
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

/**
 * Transform given RichTextContent by:
 * - Wrapping headings in link with id-attribute
 * - Inserting a table of contents (ordered-list) at the beginning
 * TODO Adapt to recursively more heading-depths
 */
export const generateRichTextContentTOC = (
  content: RichTextContent | undefined,
  maxDepth: 2 = 2,
  // maxDepth: 2 | 3 | 4 = 3,
): RichTextContent => {
  if (!content) return { children: [] }

  const children = [...(Array.isArray(content) ? content : content.children)]
  if (!children?.length) return { children: [] }
  const headingTypes = ['heading-two', 'heading-three', 'heading-four'].slice(0, 3 - (4 - maxDepth))
  const tocChildren: ElementNode[] = []

  for (let i = 0; i < children.length; i++) {
    const el = children[i]
    if (!headingTypes.includes(el?.type)) continue
    const title = el.children?.[0]?.text
    if (!title) continue
    const id = slugify(title, { strict: true, lower: true }).substring(0, 30)
    const href = `#${id}`

    // Wrap Heading in a Link
    // NOTE: There is no other option assigning an `id` attribute with RichTextContent
    children[i] = {
      id,
      href,
      type: 'link',
      className: 'heading-anchor',
      children: [el],
    }

    // Generate and append toc element
    tocChildren.push({
      type: 'list-item',
      children: [
        {
          type: 'list-item-child',
          children: [{ type: 'link', href, children: [{ text: title }] }],
        },
      ],
    })
  }

  // Wrap and finalize toc-element
  const tocElement: ElementNode = {
    type: 'class',
    className: 'table-of-contents',
    children: [
      {
        type: 'heading-two',
        children: [{ text: 'Table of Contents' }],
      },
      {
        type: 'numbered-list',
        children: tocChildren,
      },
    ],
  }

  return { children: [...(tocChildren.length > 1 ? [tocElement] : []), ...children] }
}
