import { selectOptionFocusHandle } from '@/utils'
import { forwardRef } from 'react'

interface Option {
  [key: string]: any
}

interface SelectOptionsProps {
  optionsHeight: number
  optionsWidth: string
  isShowingOptions: boolean
  options: Option[]
  customOptionTitle: ((option: Option) => string) | undefined
  valueKey: string
  titleKey: string
  emptyOptionsMessage: string
  handleSelectTriggerClick: () => void
  handleOptionClick: (option: Option) => void
}

const SelectOptions = forwardRef<HTMLDivElement, SelectOptionsProps>(
  (
    {
      optionsHeight = 300,
      optionsWidth = 'inherit',
      isShowingOptions,
      options,
      customOptionTitle,
      valueKey,
      titleKey,
      emptyOptionsMessage,
      handleSelectTriggerClick,
      handleOptionClick,
    },
    ref
  ) => {
    return (
      <div
        style={{
          maxHeight: optionsHeight,
          width: optionsWidth,
          display: isShowingOptions ? 'block' : 'none',
        }}
        className={`absolute overflow-auto drop-shadow-md border-medGrey rounded-b-lg bg-white  border-x-1 border-b-1 z-40 ${
          isShowingOptions ? 'rounded-tl-none' : ''
        }`}>
        {options && options.length > 0 && (
          <div
            style={{
              maxHeight: optionsHeight,
            }}
            ref={ref}
            tabIndex={0}
            className="cursor-pointer scroll-smooth overflow-auto pb-[14px]">
            {options.map((option) => {
              return (
                <div
                  className={`px-[10px] pt-[12px] font-sans hover:bg-background`}
                  key={option[valueKey] ?? option}
                  onMouseDown={() => handleOptionClick(option)}
                  onKeyDown={(event) => selectOptionFocusHandle(event, () => handleOptionClick(option), handleSelectTriggerClick)}
                  tabIndex={0}>
                  <span>{customOptionTitle ? customOptionTitle(option) : option[titleKey] ?? option}</span>
                </div>
              )
            })}
            {options && options.length < 1 && Boolean(emptyOptionsMessage) && <div className="p-[20px]">{emptyOptionsMessage}</div>}
          </div>
        )}
      </div>
    )
  }
)
SelectOptions.displayName = 'SelectOptions'

export default SelectOptions
