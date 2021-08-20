import Flatpickr from "react-flatpickr"
import React from "react"

const DateInput = ({
  onChange,
  options,
  containerRef,
  placeholder,
  inputComponent,
  iconComponent,
  className,
}) => (
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

export default DateInput
