import tw, { styled } from 'twin.macro'

interface BloombergBoxProps { }
export const BloombergBox = styled.div(({}: BloombergBoxProps) => [
  tw`relative border border-bbg-gray2 p-2`,
])
