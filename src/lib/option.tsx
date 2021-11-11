import React from "react"
import { BookingForm } from "./use-react-booking-form"

export const Option = ({
  optionContainer: OptionContainer,
  option,
  form,
  name,
}: {
  optionContainer: any
  option: any
  form: BookingForm
  name: string
}) => {
  const selectOption = () => {
    form.focusOn(form.formSchema[name].focusOnNext)
    form.setFieldState(name, { value: option, isOpen: false })
  }

  return (
    <OptionContainer tabIndex={-1} onClick={selectOption} option={option}>
      {option.label}
    </OptionContainer>
  )
}
