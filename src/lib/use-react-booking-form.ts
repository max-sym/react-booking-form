import { useEffect, useRef, useState } from "react"

export const useReactBookingForm = ({
  defaultForm,
  onSelectionComplete,
  autoFinish = true,
}) => {
  const [form, setForm] = useState(defaultForm)
  const checkIn = useRef<any>()
  const checkOut = useRef<any>()
  const guests = useRef<any>()

  const refs = {
    checkIn,
    checkOut,
    guests,
  }

  const focusOn = (refKey) => {
    if (refKey === "guests") {
      return refs.guests.current.focus()
    }
    refs[refKey].current.node.childNodes[0].focus()
  }

  const setFormFields = (formValues) => {
    setForm((form) => ({ ...form, ...formValues }))
  }

  useEffect(() => {
    if (!autoFinish || !(form.location && form.dateFrom && form.dateTo)) return

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
    refs,
    focusOn,
  }
}
