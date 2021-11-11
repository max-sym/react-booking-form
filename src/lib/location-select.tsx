import React from "react"
import { useLocationData } from "./use-location-data"
import { useMenuInteractions } from "./use-menu-interactions"
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
  const formStateItem = form?.state?.[name]

  const { loadOptions, isLoading, options } = useLocationData({
    debounceDelay,
    formatResults,
    name,
    form,
  })

  const { onFocus, onBlur, menuContainerRef } = useMenuInteractions({
    form,
    name,
  })

  const onChange = (event) => {
    loadOptions.current(event.target.value)
    form.setFieldState(name, { value: event.target.value, isOpen: true })
  }

  if (!formStateItem) return null

  // @ts-ignore
  const value = formStateItem.value?.label || formStateItem.value || ""

  return (
    <>
      <InputComponent
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChange}
        form={form}
        name={name}
        value={value}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        isLoading={isLoading}
        type="text"
        {...inputProps}
      />
      <Portal id="react-booking-form-menu-portal">
        <Menu
          options={options}
          optionContainer={optionContainer}
          menuContainer={menuContainer}
          isOpen={!!formStateItem?.isOpen}
          form={form}
          name={name}
          menuContainerRef={menuContainerRef}
        />
      </Portal>
    </>
  )
}
