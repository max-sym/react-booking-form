import Flatpickr from "react-flatpickr"
import React from "react"
import { BookingForm } from "lib"

type DateInputType = {
  placeholder?: string
  inputComponent?: any
  className?: string
  form: BookingForm
  name: string
}

export const DateInput = ({
  placeholder,
  inputComponent: InputComponent,
  className,
  name,
  form,
}: DateInputType) => {
  const onChange = (value) => {
    form.setFieldValue(name, value)
    form.focusOn(form.data[name].focusOnNext)
  }

  return (
    <Flatpickr
      className={className}
      onChange={onChange}
      options={{ ...form.data[name].options }}
      ref={form.refs[name]}
    >
      <InputComponent placeholder={placeholder} />
    </Flatpickr>
  )
}
