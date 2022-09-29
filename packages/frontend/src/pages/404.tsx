import { BloombergBox } from '@components/home/BloombergBox'
import { HomeLayout } from '@components/home/HomeLayout'
import {
  getSharedStaticPropsFor,
  SharedStaticProps,
  SharedStatisPropsPage,
  useSharedStaticProps,
} from '@shared/getSharedStaticProps'
import { GetStaticProps } from 'next'
import { BsQuestionDiamondFill } from 'react-icons/bs'
import 'twin.macro'

export default function PageNotFound404({ ...props }: SharedStaticProps) {
  const sharedStaticProps = useSharedStaticProps(props)

  return (
    <>
      <HomeLayout {...sharedStaticProps}>
        <BloombergBox tw="grow flex flex-col" title="404 – Page Not Found">
          <div tw="grow flex justify-center items-center mt-10 mb-20">
            <BsQuestionDiamondFill size={100} tw="opacity-[0.075]" />
          </div>
        </BloombergBox>
      </HomeLayout>
    </>
  )
}

export const getStaticProps: GetStaticProps = getSharedStaticPropsFor(SharedStatisPropsPage.ABOUT)
