import { useEffect, useState } from "react"

export const useReactBookingForm = ({ defaultForm, onSelectionComplete }) => {
  const [form, setForm] = useState(defaultForm)

  const setFormFields = (formValues) => {
    setForm((form) => ({ ...form, ...formValues }))
  }

  useEffect(() => {
    if (!(form.location && form.dateFrom && form.dateTo)) return

    onSelectionComplete?.()
  }, [form.guests])

  const checkInOptions = {
    minDate: "today",
    wrap: true,
  }

  const checkOutOptions = {
    minDate: form.dateFrom ? form.dateFrom[0] : undefined,
    wrap: true,
  }

  return {
    form,
    setForm,
    setFormFields,
    checkInOptions,
    checkOutOptions,
  }
}
