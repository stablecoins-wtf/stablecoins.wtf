import { Coin } from '@models/Coin.model'
import { useEffect, useState } from 'react'

export const useCoinsData = (coinsData: any[]) => {
  const [coins, setCoins] = useState<Coin[]>([])

  // Initialize Coins
  useEffect(() => {
    setCoins((coinsData || [])
      .map(Coin.fromObject)
      .filter(Boolean) as Coin[])
  }, [coinsData])

  return { coins }
}