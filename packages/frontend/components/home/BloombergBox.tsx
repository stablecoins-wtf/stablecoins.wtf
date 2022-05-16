import Image from 'next/image'
import topbarArrowIcon from 'public/icons/bbg/bbg-icon-arrowupright.svg'
import topbarMenuIcon from 'public/icons/bbg/bbg-icon-menu.svg'
import topbarSquareIcon from 'public/icons/bbg/bbg-icon-square.svg'
import { FC } from 'react'
import tw, { styled } from 'twin.macro'

const BloombergBoxWrapper = styled.div(() => [
  tw`relative border border-bbg-gray3 p-2 overflow-hidden`,
])

export interface BloombergBoxProps {
  hideTopBar?: boolean
  title?: string
}
export const BloombergBox: FC<BloombergBoxProps> = ({children, hideTopBar, title, ...props}) => {

  return <>
    <BloombergBoxWrapper {...props}>
      <div tw="flex flex-col">
        {!hideTopBar &&
          <div tw="flex justify-between text-bbg-gray2 text-sm mb-2">
            <h3>{title}</h3>
            <div tw="flex items-center select-none space-x-4">
              <div tw="flex items-center space-x-2">
                <Image src={topbarMenuIcon} width={10} height={10} />
                <span>Options</span>
              </div>
              <div><Image src={topbarArrowIcon} width={10} height={10} /></div>
              <div><Image src={topbarSquareIcon} width={10} height={10} /></div>
            </div>
          </div>}
        <main>{children}</main>
      </div>
    </BloombergBoxWrapper>
  </>
}