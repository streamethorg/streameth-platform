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
  dropdownPosition: string
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
      dropdownPosition,
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
        className={`absolute overflow-auto border-medGrey  bg-white border-x  z-40 ${
          dropdownPosition === 'top'
            ? 'bottom-full rounded-t-lg drop-shadow-top rounded-b-none border-t '
            : 'drop-shadow-card rounded-b-lg rounded-t-none border-b'
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
                  onKeyDown={(event) =>
                    selectOptionFocusHandle(
                      event,
                      () => handleOptionClick(option),
                      handleSelectTriggerClick
                    )
                  }
                  tabIndex={0}>
                  <span>
                    {customOptionTitle
                      ? customOptionTitle(option)
                      : option[titleKey] ?? option}
                  </span>
                </div>
              )
            })}
            {options &&
              options.length < 1 &&
              Boolean(emptyOptionsMessage) && (
                <div className="p-[20px]">{emptyOptionsMessage}</div>
              )}
          </div>
        )}
      </div>
    )
  }
)
SelectOptions.displayName = 'SelectOptions'

export default SelectOptions
