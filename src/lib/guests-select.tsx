import React, { useMemo } from "react"

export const GuestsSelect = ({
  containerRef,
  onChange,
  quantity = 20,
  className,
  placeholder,
}) => {
  const options = useMemo(() => [...Array(quantity)].map((_v, i) => i), [])

  return (
    <select
      className={className}
      defaultValue="guests"
      onChange={onChange}
      ref={containerRef}
    >
      <option disabled value="guests">
        {placeholder}
      </option>
      {options.map((option, index) => (
        <option key={index}>{index}</option>
      ))}
    </select>
  )
}
