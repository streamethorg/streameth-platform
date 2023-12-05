import { useEffect, useRef, useState } from 'react'

import SelectOptions from './SelectOptions'
import FormLabel from './FormLabel'
import ArrowDownIcon from '../icons/ArrowDownIcon'
import useClickOutside from '../../hooks/useClickOutside'

interface Option {
  [key: string]: any
}

interface FormSelectProps {
  id?: string
  label: string
  required?: boolean
  placeholder?: string
  value: string | Option
  onChange?: (option: Option) => void
  options: Option[]
  customOptionTitle?: any
  titleKey?: string
  valueKey?: string
  maximumTitleLength?: number
  containerWidth?: string
  disabled?: boolean
  optionsHeight?: number
  optionsWidth?: string
  emptyOptionsMessage?: string
  toolTip?: boolean
  toolTipHTML?: string
  validationErrors?: Record<string, any> | string | undefined
}

const FormSelect = ({
  label,
  placeholder,
  value,
  onChange,
  options,
  customOptionTitle,
  titleKey = 'title',
  valueKey = 'value',
  maximumTitleLength = 40,
  containerWidth = '100%',
  disabled,
  optionsHeight = 200,
  optionsWidth = 'inherit',
  emptyOptionsMessage = 'No options available',
  toolTip,
  required,
  toolTipHTML,
  validationErrors,
}: FormSelectProps) => {
  const [isShowingOptions, setIsShowingOptions] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState('bottom')
  const optionsRef = useRef<HTMLDivElement>(null)
  const selectRef = useRef<HTMLDivElement>(null)

  useClickOutside(selectRef, () => setIsShowingOptions(false))

  const handleSelectTriggerClick = () =>
    setIsShowingOptions(!isShowingOptions)
  const handleOptionClick = (option: any) => {
    onChange?.(option)
    setIsShowingOptions(false)
  }

  useEffect(() => {
    if (selectRef.current) {
      const inputRect = selectRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - inputRect.bottom

      if (
        spaceBelow < optionsHeight &&
        dropdownPosition === 'bottom'
      ) {
        setDropdownPosition('top')
      } else if (
        spaceBelow >= optionsHeight &&
        dropdownPosition === 'top'
      ) {
        setDropdownPosition('bottom')
      }
    }
  }, [selectRef, optionsHeight, dropdownPosition])

  const getFormattedSelectedOptionTitle = (option: any) => {
    const title = customOptionTitle
      ? customOptionTitle(option!)
      : option
    if (title?.length! > maximumTitleLength) {
      return `${title!.substring(0, maximumTitleLength)}...`
    }
    return title
  }

  return (
    <div className="relative mb-5">
      {label && (
        <FormLabel
          label={label}
          toolTip={toolTip}
          required={required}
          toolTipHTML={toolTipHTML}
        />
      )}
      <div
        ref={selectRef}
        style={{ width: containerWidth }}
        className={`relative  ${
          disabled ? 'pointer-events-none' : ''
        }`}
        onFocus={() => {
          setIsShowingOptions(true)
        }}>
        <div
          className={`${
            isShowingOptions
              ? dropdownPosition === 'top'
                ? 'rounded-t-none rounded-b-lg'
                : 'rounded-t-lg'
              : 'rounded-lg'
          } ${
            validationErrors ? 'border-danger' : 'border-medGrey'
          } h-12 p-3 w-full  border  bg-transparent font-sans disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-between cursor-pointer 
            
          `}
          onMouseDown={() => handleSelectTriggerClick()}>
          {getFormattedSelectedOptionTitle(value) ? (
            <span className="font-sans">
              {getFormattedSelectedOptionTitle(value)}
            </span>
          ) : (
            <span className="font-sans text-grey">{placeholder}</span>
          )}
          <ArrowDownIcon />
        </div>
        {validationErrors && typeof validationErrors === 'string' && (
          <div className="text-danger mt-2">{validationErrors}</div>
        )}

        <SelectOptions
          options={options}
          customOptionTitle={customOptionTitle}
          titleKey={titleKey}
          valueKey={valueKey}
          handleOptionClick={handleOptionClick}
          handleSelectTriggerClick={handleSelectTriggerClick}
          ref={optionsRef}
          optionsHeight={optionsHeight}
          optionsWidth={optionsWidth}
          isShowingOptions={isShowingOptions}
          emptyOptionsMessage={emptyOptionsMessage}
          dropdownPosition={dropdownPosition}
        />
      </div>
    </div>
  )
}

export { FormSelect }
