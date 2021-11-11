import React from "react"
import { useMenuInteractions } from "./use-menu-interactions"
import { Menu } from "./menu"
import { Portal } from "./portal"
import { BookingForm } from "./use-react-booking-form"

export type GuestsSelectProps = {
  formatResults?: any
  debounceDelay?: number
  form: BookingForm
  name: string
  menuContainer: any
  optionComponent: any
  controlComponent: any
  controlProps: any
}

export const GuestsSelect = ({
  name,
  form,
  menuContainer,
  optionComponent,
  controlComponent: ControlComponent,
  controlProps,
}: GuestsSelectProps) => {
  const formStateItem = form?.state?.[name]

  const options = form.state?.[name]?.value || []

  const { onFocus, onBlur, menuContainerRef } = useMenuInteractions({
    form,
    name,
  })

  const onChange = (event) => {
    form.setFieldState(name, { value: event.target.value, isOpen: true })
  }

  if (!formStateItem) return null

  return (
    <>
      <ControlComponent
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChange}
        form={form}
        name={name}
        value={formStateItem.value || ""}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        type="text"
        {...controlProps}
      />
      <Portal id="react-booking-form-menu-portal">
        <Menu
          options={options as any}
          optionComponent={optionComponent}
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
