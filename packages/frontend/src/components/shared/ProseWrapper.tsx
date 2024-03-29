import { Article, ArticleType } from '@models/Article.model'
import { useRouter } from 'next/router'
import { FC, PropsWithChildren } from 'react'
import 'twin.macro'
import tw, { styled } from 'twin.macro'

const StyledProseWrapper = styled.div`
  // Base Styles
  ${tw`
    prose prose-invert w-full max-w-[50rem] mx-auto px-4
    prose-p:(text-justify)
    prose-ul:(list-['⋇'])
    prose-h2:(mt-1 pt-2)
    prose-h3:(mt-1 pt-1)
    prose-hr:(border-bbg-gray3)
  `}

  // Heading Anchors
  .heading-anchor {
    ${tw`no-underline!`}
  }

  // Table of Contents
  .table-of-contents {
    ${tw`border-b border-bbg-gray3 mb-6 pb-6`}
  }
  .table-of-contents > h2 {
    ${tw`text-sm text-gray-500 font-semibold pt-0`}
  }
  .table-of-contents > ol {
    ${tw`m-0`}
  }
  .table-of-contents > ol li {
    ${tw`my-0.5`}
  }
  .table-of-contents > ol li a {
    ${tw`no-underline font-semibold underline-offset-2 hover:(underline)`}
  }
`

export const ProseWrapper: FC<PropsWithChildren> = ({ children, ...props }) => {
  const { asPath: path } = useRouter()
  const legalBasePath = Article.getArticleTypeBasePath(ArticleType.Legal)
  const isLegalPage = path.startsWith(legalBasePath)

  return (
    <>
      <StyledProseWrapper
        {...props}
        css={[!isLegalPage && tw`prose-img:(mx-auto border border-bbg-gray3 p-2)`]}
      >
        {children}
      </StyledProseWrapper>
    </>
  )
}
