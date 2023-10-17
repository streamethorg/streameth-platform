export const selectOptionFocusHandle = (
  event: React.KeyboardEvent<HTMLDivElement>,
  optionClickCallback: () => void,
  triggerClickCallback: () => void
): void => {
  if (event.key !== 'Tab') {
    event.preventDefault()
    optionClickCallback()
    triggerClickCallback()
  }
}

export const a11yEnterKeyPress = (event: React.KeyboardEvent, callback: () => void) => {
  if (event.key === 'Enter') {
    callback()
  }
}

export const handleKeyPress = (event: React.KeyboardEvent, targetKey: string | string[], callback: () => void): void => {
  if (Array.isArray(targetKey) && targetKey.includes(event.key)) {
    callback()
    return
  }
  if (event.key === targetKey) {
    callback()
  }
}

export const truncateAddr = (address: string, startLength = 6, endLength = 4) => {
  if (!address) {
    return ''
  }
  const truncatedStart = address.substring(0, startLength)
  const truncatedEnd = address.substring(address.length - endLength)
  return `${truncatedStart}...${truncatedEnd}`
}
