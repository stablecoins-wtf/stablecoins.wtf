import { FC } from 'react'
import 'twin.macro'
import { BloombergBox } from './BloombergBox'

export interface HomeStartPageProps {}
export const HomeStartPage: FC<HomeStartPageProps> = () => {

  return <>
    <BloombergBox title="Select coin…">
      <p>Sed posuere consectetur est at lobortis. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Maecenas faucibus mollis interdum. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
    </BloombergBox>
  </>
}