import { KPI, KPIContent, KPIsWrapper, KPITitle } from '@components/layout/KPIs'
import { CoinMechanism } from '@models/Coin.model'
import Link from 'next/link'
import { FC } from 'react'
import { BsInfoCircle } from 'react-icons/bs'
import 'twin.macro'
import { CoinDetailsProps } from './CoinDetails'

export const CoinMetadataAndLegal: FC<CoinDetailsProps> = ({ coin }) => {
  const mechanismLinks: { [key in CoinMechanism]?: string } = {
    [CoinMechanism.ALGORITHMIC]: '/resources/algorithmic-stablecoins',
    [CoinMechanism.FIAT_BACKED]: '/resources/fiat-backed-stablecoins',
    [CoinMechanism.CRYPTO_BACKED]: '/resources/crypto-backed-stablecoins',
  }
  const mechanismLink = mechanismLinks[coin.mechanism]

  return (
    <>
      <KPIsWrapper>
        {coin.mechanism && (
          <KPI>
            <h3 tw="sr-only">Type of Stablecoin Mechanism</h3>
            <KPITitle>Mechanism</KPITitle>
            <KPIContent>
              {mechanismLink ? (
                <Link
                  href={mechanismLink}
                  tw="flex items-center underline-offset-2 underline cursor-pointer"
                >
                  <span>{coin.mechanismFormatted()}</span>
                  <BsInfoCircle tw="ml-2 -translate-y-px" />
                </Link>
              ) : (
                coin.mechanismFormatted()
              )}
            </KPIContent>
          </KPI>
        )}
        {coin.governance && (
          <KPI>
            <h3 tw="sr-only">Legal Entity & Protocol Governance</h3>
            <KPITitle>Governance</KPITitle>
            <KPIContent>{coin.governance}</KPIContent>
          </KPI>
        )}
        {coin.issuer && (
          <KPI>
            <h3 tw="sr-only">Legal Issuer</h3>
            <KPITitle>Issuer</KPITitle>
            <KPIContent>{coin.issuer}</KPIContent>
          </KPI>
        )}
        {coin.jurisdiction && (
          <KPI>
            <h3 tw="sr-only">Legal Jurisdiction</h3>
            <KPITitle>Jurisdiction</KPITitle>
            <KPIContent>{coin.jurisdiction}</KPIContent>
          </KPI>
        )}
      </KPIsWrapper>
    </>
  )
}
