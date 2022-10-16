import { ProseWrapper } from '@components/shared/ProseWrapper'
import { FC, useState } from 'react'
import { Tweet } from 'react-twitter-widgets'
import 'twin.macro'
import tw from 'twin.macro'
import { ArticleContentProps } from './ArticleContent'

export interface ArticleRelatedTweetProps extends ArticleContentProps {}
export const ArticleRelatedTweet: FC<ArticleRelatedTweetProps> = ({ item }) => {
  const [tweetIsLoading, setTweetIsLoading] = useState(true)
  if (!item.relatedTweetId) return null
  return (
    <>
      <ProseWrapper>
        <h2>Related Tweet</h2>

        <div
          css={[
            tw`mb-6`,
            tweetIsLoading && tw`h-[300px] w-[500px] rounded-[12px] bg-gray-800 animate-pulse`,
          ]}
        >
          <Tweet
            tweetId={item.relatedTweetId}
            options={{
              width: '500px',
              theme: 'dark',
            }}
            onLoad={() => setTweetIsLoading(false)}
          />
        </div>
      </ProseWrapper>
    </>
  )
}
