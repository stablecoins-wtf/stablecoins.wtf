import Image from 'next/image'
import topbarArrowIcon from 'public/icons/bbg/bbg-icon-arrowupright.svg'
import topbarCrossIcon from 'public/icons/bbg/bbg-icon-cross.svg'
import topbarMenuIcon from 'public/icons/bbg/bbg-icon-menu.svg'
import topbarSquareIcon from 'public/icons/bbg/bbg-icon-square.svg'
import { FC, PropsWithChildren } from 'react'
import tw, { styled } from 'twin.macro'

const BloombergBoxWrapper = styled.div(() => [
  tw`grow-0 flex flex-col relative border border-bbg-gray3 overflow-scroll`,
])

export const BloombergBoxHR = tw.hr`border-bbg-gray3 -mx-3 my-5`

export interface BloombergBoxProps {
  hideTopBar?: boolean
  title?: string
  noHeadingMarkup?: boolean
  isClosable?: boolean
  onClosed?: () => void
}
export const BloombergBox: FC<PropsWithChildren<BloombergBoxProps>> = ({
  children,
  hideTopBar,
  isClosable,
  onClosed,
  title,
  noHeadingMarkup,
  ...props
}) => {
  return (
    <>
      <BloombergBoxWrapper {...props}>
        {/* Top Bar */}
        {!hideTopBar && <BloomberBoxTopBar {...{ title, noHeadingMarkup, isClosable, onClosed }} />}

        {/* Content */}
        <main css={[tw`flex flex-col pb-2 px-3`, hideTopBar && tw`pt-2`]}>{children}</main>
      </BloombergBoxWrapper>
    </>
  )
}

export const BloomberBoxTopBar: FC<Partial<BloombergBoxProps>> = ({
  title,
  noHeadingMarkup,
  isClosable,
  onClosed,
}) => {
  return (
    <>
      <div tw="sticky top-0 w-full z-50 bg-black bg-opacity-50 backdrop-blur flex justify-between text-bbg-gray2 text-sm p-2 px-3">
        {noHeadingMarkup ? <span>{title}</span> : <h2>{title}</h2>}
        <div tw="shrink-0 flex items-center select-none space-x-4">
          {isClosable ? (
            <button
              tw="flex items-center space-x-2 self-center text-white bg-white bg-opacity-0 px-1 -mr-1 hover:bg-opacity-10"
              onClick={() => onClosed?.()}
            >
              <Image src={topbarCrossIcon} width={10} height={10} alt="Close Button Icon" />
              <span>Hide</span>
            </button>
          ) : (
            <>
              <div>
                <Image
                  src={topbarMenuIcon}
                  width={10}
                  height={10}
                  alt="Decorative Options Icon"
                  tw="opacity-50"
                />
              </div>
              <div>
                <Image
                  src={topbarArrowIcon}
                  width={10}
                  height={10}
                  alt="Decorative Arrow Icon"
                  tw="opacity-50"
                />
              </div>
              <div>
                <Image
                  src={topbarSquareIcon}
                  width={10}
                  height={10}
                  alt="Decorative Square Icon"
                  tw="opacity-50"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
