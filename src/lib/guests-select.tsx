import React, { useMemo } from "react"
import Select from "react-select"
import { BookingForm } from "./use-react-booking-form"

export type GuestsSelectProps = {
  quantity?: number
  className?: string
  placeholder?: string
  form: BookingForm
  components?: any
  name: string
}

export const GuestsSelect = ({
  form,
  name,
  className,
  components,
  placeholder = "Guests count",
  ...props
}: GuestsSelectProps) => {
  const item = form.data[name]

  const options = useMemo(
    () =>
      [...Array(item.options.max)].map((_v, i) => ({
        value: i,
        label: `${i}`,
      })),
    [item]
  )

  return (
    <Select
      className={className}
      defaultValue="guests"
      options={options}
      ref={form.refs[name]}
      components={components}
      openMenuOnFocus
      placeholder={placeholder}
      {...props}
    />
  )
}
