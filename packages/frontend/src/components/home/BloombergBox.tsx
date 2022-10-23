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
  title?: string
  hideTopBar?: boolean
  noHeadingMarkup?: boolean
  noStickyTopBar?: boolean
  isClosable?: boolean
  onClosed?: () => void
}
export const BloombergBox: FC<PropsWithChildren<BloombergBoxProps>> = ({
  children,
  hideTopBar,
  title,
  noHeadingMarkup,
  noStickyTopBar,
  isClosable,
  onClosed,
  ...props
}) => {
  return (
    <>
      <BloombergBoxWrapper {...props}>
        {/* Top Bar */}
        <BloomberBoxTopBar
          {...{ hideTopBar, title, noHeadingMarkup, noStickyTopBar, isClosable, onClosed }}
        />

        {/* Content */}
        <main css={[tw`grow flex flex-col pb-2 px-3`, hideTopBar && tw`pt-2`]}>{children}</main>
      </BloombergBoxWrapper>
    </>
  )
}

export const BloomberBoxTopBar: FC<Partial<BloombergBoxProps>> = ({
  title,
  hideTopBar,
  noHeadingMarkup,
  noStickyTopBar,
  isClosable,
  onClosed,
  ...props
}) => {
  if (hideTopBar && (!title || noHeadingMarkup)) return null

  return (
    <>
      <div
        css={[
          tw`w-full z-50 bg-black bg-opacity-50 backdrop-blur flex justify-between text-bbg-gray2 text-sm p-2 px-3`,
          !noStickyTopBar && tw`sticky top-0`,
          hideTopBar && tw`sr-only`,
        ]}
        {...props}
      >
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
