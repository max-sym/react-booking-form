import moment from "moment"
import { useState } from "react"

const useReactBookingForm = ({ defaultForm, resultsPageURL }) => {
  const [form, setForm] = useState(defaultForm)

  const convertFormToURLParams = () => {
    const parsedForm = {
      location: form.location.value,
      dateTo: moment(form.dateTo[0]).format("yyyy-MM-DD"),
      dateFrom: moment(form.dateFrom[0]).format("yyyy-MM-DD"),
      guests: form.guests,
    }
    return new URLSearchParams(parsedForm).toString()
  }

  const goToResultsPage = () => {
    window.location.href = `${resultsPageURL}?${convertFormToURLParams()}`
  }

  const setFormFields = (formValues) => {
    setForm((form) => ({ ...form, ...formValues }))
  }

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
    convertFormToURLParams,
    goToResultsPage,
    checkInOptions,
    checkOutOptions,
  }
}

export default useReactBookingForm
