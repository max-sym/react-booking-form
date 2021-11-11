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
  const position = useMemo(() => {
    const ref = form.refs[name].current
    if (!ref) return {}

    const inputPosition = ref.getBoundingClientRect()

    return {
      x: window.pageXOffset + inputPosition.left,
      y: window.pageYOffset + inputPosition.top,
    }
  }, [isOpen])

  const RealOptionContainer = useMemo(() => OptionComponent || Option, [
    OptionComponent,
  ])

  return (
    <MenuContainer
      isOpen={isOpen}
      style={{
        position: "absolute",
        top: position.y || 0,
        left: position.x || 0,
      }}
      ref={menuContainerRef}
    >
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
