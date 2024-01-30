import { useState } from 'react'
import { IStage } from 'streameth-new-server/src/interfaces/stage.interface'
import { apiUrl } from '@/lib/utils/utils'

export const useCreateStage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [data, setData] = useState<IStage | null>(null)

  const createStage = async ({ stage }: { stage: IStage }) => {
    setIsLoading(true)
    setIsError(false)
    setIsSuccess(false)
    try {
      const res = await fetch(`${apiUrl()}/stages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stage),
      })
      const data = await res.json()
      setData(data)
      setIsSuccess(true)
    } catch (error) {
      setIsError(true)
    }
    setIsLoading(false)
  }

  return { isLoading, isError, isSuccess, data, createStage }
}
