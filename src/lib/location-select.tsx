import debounce from "debounce-promise"
import React, { useRef, useState } from "react"
import { Portal } from "./portal"
import { BookingForm } from "./use-react-booking-form"

export type LocationSelectProps = {
  onLocationChange?: any
  searchPlace?: any
  formatResults?: any
  debounceDelay?: number
  form: BookingForm
  name: string
}

const AsyncSelect = ({ components }) => {
  const [isOpen, setIsOpen] = useState(false)

  const onClick = () => {
    setIsOpen((isOpen) => !isOpen)
  }

  return (
    <div>
      {React.cloneElement(components.control, { onClick })}
      <Portal id="select-menu-portal">
        {React.cloneElement(
          components.menu,
          {
            style: {
              position: "absolute",
              top: "100px",
              left: "100px",
            },
          },
          React.cloneElement(components.option)
        )}
      </Portal>
    </div>
  )
}

const components = {
  menu: <div className="bg-white w-10 h-10" />,
  option: <div />,
  control: <div className="w-full bg-red-300 h-10" />,
}

export const LocationSelect = ({
  formatResults,
  debounceDelay = 500,
  name,
  form,
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
      ref={form.refs[name]}
      openMenuOnFocus
      defaultOptions={formItem?.options?.defaultLocationOptions}
      components={components}
    />
  )
}
