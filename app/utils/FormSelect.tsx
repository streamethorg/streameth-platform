import { useRef, useState } from 'react'

import SelectOptions from './SelectOptions'
import FormLabel from './FormLabel'
import ArrowDownIcon from '../assets/icons/ArrowDownIcon'
import useClickOutside from '../hooks/useClickOutside'

interface Option {
  title: string
  value: string
}

interface FormSelectProps {
  id?: string
  label: string
  required?: boolean
  placeholder?: string
  value: string | Option
  onChange?: (option: string) => void | ((option: Option) => void)
  options: String[] | Option[]
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
}: FormSelectProps) => {
  const [isShowingOptions, setIsShowingOptions] = useState(false)
  const optionsRef = useRef<HTMLDivElement>(null)
  const selectRef = useRef<HTMLDivElement>(null)

  useClickOutside(selectRef, () => setIsShowingOptions(false))

  const handleSelectTriggerClick = () => setIsShowingOptions(!isShowingOptions)
  const handleOptionClick = (option: any) => {
    onChange?.(option)
    setIsShowingOptions(false)
  }

  const getFormattedSelectedOptionTitle = (option: any) => {
    const title = customOptionTitle ? customOptionTitle(option!) : option
    if (title?.length! > maximumTitleLength) {
      return `${title!.substring(0, maximumTitleLength)}...`
    }
    return title
  }

  return (
    <div className="relative mb-5">
      {label && <FormLabel label={label} toolTip={toolTip} required={required} toolTipHTML={toolTipHTML} />}
      <div
        ref={selectRef}
        style={{ width: containerWidth }}
        className={`relative  ${disabled ? 'pointer-events-none' : ''}`}
        onFocus={() => {
          setIsShowingOptions(true)
        }}>
        <div
          className={`h-12 p-3 w-full border-medGrey border-1 rounded-lg bg-transparent font-sans disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-between cursor-pointer ${
            isShowingOptions ? 'rounded-bl-none rounded-br-none' : ''
          }`}
          onMouseDown={() => handleSelectTriggerClick()}>
          {getFormattedSelectedOptionTitle(value) ? (
            <span className="font-sans">{getFormattedSelectedOptionTitle(value)}</span>
          ) : (
            <span className="font-sans text-grey">{placeholder}</span>
          )}
          <ArrowDownIcon />
        </div>

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
        />
      </div>
    </div>
  )
}

export { FormSelect }
