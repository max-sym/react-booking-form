import Flatpickr from "react-flatpickr"
import React from "react"

type DateInputType = {
  onChange?: any
  options?: any
  containerRef?: any
  placeholder?: string
  inputComponent?: any
  iconComponent?: any
  className?: string
}

export const DateInput = ({
  onChange,
  options,
  containerRef,
  placeholder,
  inputComponent,
  iconComponent,
  className,
}: DateInputType) => (
  <Flatpickr
    className={className}
    onChange={onChange}
    options={options}
    ref={containerRef}
  >
    {React.cloneElement(inputComponent, {
      "data-input": true,
      placeholder,
      type: "text",
    })}
    {React.cloneElement(iconComponent, {
      "data-toggle": true,
      title: "toggle",
    })}
  </Flatpickr>
)
