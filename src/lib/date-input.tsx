import React, { useMemo } from "react"
import Flatpickr from "react-flatpickr"
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
  const item = form.formSchema[name]

  const onChange = (value) => {
    form.setFieldValue(name, value)
    form.focusOn(item.focusOnNext)
  }

  const options = useMemo(() => {
    const minDateFrom = item?.options?.minDateFrom
    if (!minDateFrom) return { ...item.options }

    const minDate = minDateFrom ? form.state[minDateFrom].value?.[0] : null

    return { ...item.options, minDate: minDate || undefined }
  }, [form.state])

  return (
    <Flatpickr className={className} onChange={onChange} options={options}>
      <InputComponent placeholder={placeholder} inputRef={form.refs[name]} />
    </Flatpickr>
  )
}
