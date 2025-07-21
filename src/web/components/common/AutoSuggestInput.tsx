import React, { useState, useRef, useEffect } from 'react'
import Label from './Label'

export default function AutoSuggestInput({
  options,
  getLabel,
  getValue,
  defaultValue,
  onSelect,
  label,
  placeholder,
  name,
}: {
  defaultValue?: string
  options: any[]
  getLabel: (option: any) => string
  getValue: (option: any) => string
  onSelect: (value: string) => void
  label?: string
  placeholder?: string
  name?: string
}) {
  const [inputValue, setInputValue] = useState(defaultValue || '')
  const [filteredOptions, setFilteredOptions] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isTyping) {
      return
    }

    if (inputValue) {
      const filtered = options.filter((option) =>
        getLabel(option).toLowerCase().includes(inputValue.toLowerCase())
      )
      setFilteredOptions(filtered)
      setIsOpen(filtered.length > 0)
    } else {
      setFilteredOptions([])
      setIsOpen(false)
    }
  }, [inputValue, options, getLabel, isTyping])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = (option: any) => {
    const value = getValue(option)
    const label = getLabel(option)
    setIsTyping(false)
    setInputValue(label)
    onSelect(value)
    setIsOpen(false)
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <div className="mb-0.5">
          <Label text={label} />
        </div>
      )}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value)
          setIsTyping(true)
        }}
        placeholder={placeholder}
        name={name}
        className="w-full rounded-lg border-[1.5px] border-gray-300 p-2 text-sm transition placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <ul className="max-h-60 overflow-auto rounded-md py-1 text-base focus:outline-none sm:text-sm">
            {filteredOptions.map((option, idx) => (
              <li
                key={idx}
                className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-100"
                onClick={() => handleSelect(option)}
              >
                <span className="block truncate text-sm font-normal">{getLabel(option)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
