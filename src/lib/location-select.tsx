import debounce from "debounce-promise"
import React, { useRef, useState } from "react"
import AsyncSelect from "react-select/async"
import { BookingForm } from "./use-react-booking-form"

const defaultStyles = {
  control: (provided) => ({
    ...provided,
    border: "none",
    borderRadius: "0px",
    borderColor: "transparent",
    boxShadow: "none",
    "&:hover": {
      borderColor: "transparent",
    },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "24px",
  }),
  menuList: (provided) => ({
    ...provided,
    padding: 0,
    borderRadius: "24px",
  }),
  option: (provided) => ({
    ...provided,
    padding: "12px 18px",
    cursor: "pointer",
  }),
}

export type LocationSelectProps = AsyncSelect & {
  onLocationChange?: any
  searchPlace?: any
  formatResults?: any
  debounceDelay?: number
  form: BookingForm
  name: string
}

export const LocationSelect = ({
  formatResults,
  debounceDelay = 500,
  styles,
  name,
  form,
  ...props
}: LocationSelectProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const formItem = form?.data?.[name]

  const getPlaces = async (queryString) => {
    const options = formItem?.options
    if (!options?.searchPlace) return

    setIsLoading(true)
    return await options.searchPlace(queryString).then((results) => {
      setIsLoading(false)
      return formatResults?.(results) || results
    })
  }

  const onChange = (value, { action }) => {
    if (action !== "select-option") return

    form.setFieldValue(name, value)
    form.focusOn(formItem.focusOnNext)
  }

  const loadOptionsDebounce = useRef(
    debounce(getPlaces, debounceDelay, { leading: false })
  )

  const loadOptions = useRef((input) => loadOptionsDebounce.current(input))

  if (!formItem) return null

  return (
    <AsyncSelect
      isLoading={isLoading}
      loadOptions={loadOptions.current}
      onChange={onChange}
      styles={{ ...defaultStyles, ...styles }}
      defaultOptions={formItem?.options?.defaultLocationOptions}
      {...props}
    />
  )
}
