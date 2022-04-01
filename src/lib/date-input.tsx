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

  const onChange = (value: Date) => {
    form.setFieldValue(name, value)

    // If the user presses Enter key to change the date in the current date selector
    // and the focusOnNext field happens to be another date field then it would
    // set that date field to the same value as the former and skip to the next
    // field in the line. This timeout seems to solve this issue
    setTimeout(() => {
      form.focusOn(item.focusOnNext)
    }, 0)
  }

  const options = useMemo(() => {
    const minDateFrom = item?.options?.minDateFrom
    if (!minDateFrom) return { ...item.options }

    const minDate = minDateFrom ? form.state[minDateFrom].value?.[0] : null

    return { ...item.options, minDate: minDate || undefined }
  }, [form.state])

  return (
    <Flatpickr className={className} onChange={onChange} options={options}>
      <InputComponent
        placeholder={placeholder}
        form={form}
        name={name}
        containerRef={form.refs[name]}
      />
    </Flatpickr>
  )
}
