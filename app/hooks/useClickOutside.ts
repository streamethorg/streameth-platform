import { useEffect, RefObject } from 'react'

type EventCallback = () => void

export default function useClickOutside(ref: RefObject<HTMLElement>, callBack: EventCallback) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node) && callBack) {
        callBack()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, callBack])
}
