import debounce from "debounce-promise"
import React, { useRef, useState } from "react"
import { Menu } from "./menu"
import { Portal } from "./portal"
import { BookingForm } from "./use-react-booking-form"

export type LocationSelectProps = {
  formatResults?: any
  debounceDelay?: number
  form: BookingForm
  name: string
  menuContainer: any
  optionContainer: any
  inputComponent: any
  inputProps: Partial<HTMLInputElement>
}

export const LocationSelect = ({
  formatResults,
  debounceDelay = 500,
  name,
  form,
  menuContainer,
  optionContainer,
  inputComponent: InputComponent,
  inputProps,
}: LocationSelectProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const formStateItem = form?.state?.[name]
  const formSchemaItem = form?.formSchema?.[name]

  const [options, setOptions] = useState(
    formSchemaItem.options.defaultLocationOptions
  )

  const getPlaces = async (queryString) => {
    const options = formSchemaItem?.options
    if (!options?.searchPlace) return

    setIsLoading(true)
    return await options.searchPlace(queryString).then((results) => {
      setIsLoading(false)
      const options = formatResults?.(results) || results
      setOptions(options)
    })
  }

  const loadOptionsDebounce = useRef(
    debounce(getPlaces, debounceDelay, { leading: false })
  )

  const loadOptions = useRef((input) => loadOptionsDebounce.current(input))

  const onFocus = () => {
    form.setFieldState(name, { isOpen: true })
  }

  const menuContainerRef = useRef<HTMLElement>(null)

  const onBlur = () => {
    setTimeout(() => {
      if (menuContainerRef.current?.contains?.(document.activeElement)) {
        form.refs[name].current.focus()
        return
      }

      form.setFieldState(name, { isOpen: false })
    }, 10)
  }

  const onChange = (event) => {
    loadOptions.current(event.target.value)
    form.setFieldState(name, { value: event.target.value, isOpen: true })
  }

  if (!formStateItem) return null

  return (
    <>
      <InputComponent
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChange}
        form={form}
        name={name}
        value={formStateItem.value?.label || formStateItem.value || ""}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        isLoading={isLoading}
        type="text"
        {...inputProps}
      />
      <Portal id="location-menu-portal">
        <Menu
          options={options}
          optionContainer={optionContainer}
          menuContainer={menuContainer}
          isOpen={formStateItem?.isOpen}
          form={form}
          name={name}
          menuContainerRef={menuContainerRef}
        />
      </Portal>
    </>
  )
}
