import { BookingForm, GuestOption, LocationOption } from "lib"
import React from "react"
import { useMemo } from "react"
import { Option } from "./option"

export const Menu = ({
  menuContainer: MenuContainer,
  optionContainer,
  options,
  isOpen,
  form,
  name,
  menuContainerRef,
  optionComponent: OptionComponent,
}: {
  menuContainer: React.ComponentType<any>
  optionContainer?: React.ComponentType<any>
  options: GuestOption[] | LocationOption[]
  isOpen: boolean
  form: BookingForm
  name: string
  menuContainerRef: React.RefObject<HTMLDivElement>
  optionComponent?: React.ComponentType<any>
}) => {
  const RealOptionContainer = useMemo(() => OptionComponent || Option, [
    OptionComponent,
  ])

  return (
    <MenuContainer isOpen={isOpen} ref={menuContainerRef}>
      {options.map((option) => (
        <RealOptionContainer
          form={form}
          name={name}
          option={option}
          optionContainer={optionContainer}
          key={option.name || option.value}
        />
      ))}
    </MenuContainer>
  )
}
