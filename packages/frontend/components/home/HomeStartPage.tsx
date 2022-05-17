import { FC } from 'react'
import 'twin.macro'
import { BloombergBox } from './BloombergBox'

export interface HomeStartPageProps {}
export const HomeStartPage: FC<HomeStartPageProps> = () => {

  return <>
    <BloombergBox title="Select coin…">
      <div tw="prose prose-invert max-w-full">
        <h3>To-Dos:</h3>
        <ul>
          <li>⋇ [high] Add to Table: Type, Collateralization Ratio, Governance, Warnings</li>
          <li>⋇ [high] Glossary and Educational Content on StartPage</li>
          <li>⋇ [high] CoinDetailPages (with Graphs, KPIs, Newsticker)</li>
          <li>⋇ [high] Make content linkable</li>
          <li>⋇ Add Newsticker per Coin </li>
          <li>⋇ Add tooltips to Table </li>
          <li>⋇ Make Table sortable</li>
          <li>⋇ Maybe define Framework for a custom "Stablecoin Security/Trust Score"</li>
        </ul>
      </div>
    </BloombergBox>
  </>
}