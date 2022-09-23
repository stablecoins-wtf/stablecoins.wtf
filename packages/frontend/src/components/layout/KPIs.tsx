import tw, { styled } from 'twin.macro'

export const KPIsWrapper = styled.div(() => [tw`flex flex-wrap -mx-0.5 -mt-0.5 mb-6`])
export const KPI = styled.div(() => [
  tw`flex-1 m-0.5 bg-bbg-gray3 border-t border-[#404040] p-1 px-2`,
])
export const KPITitle = styled.div(() => [tw`block text-bbg-gray1 text-sm mb-1 whitespace-nowrap `])
export const KPIContent = styled.div(() => [tw`block font-semibold`])
