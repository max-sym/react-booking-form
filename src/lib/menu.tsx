import React, { useMemo } from "react"
import { Option } from "./option"

export const Menu = ({
  menuContainer: MenuContainer,
  optionContainer,
  options,
  isOpen,
  form,
  name,
  menuContainerRef,
}) => {
  const position = useMemo(
    () => form.refs[name]?.current?.getBoundingClientRect?.(),
    [isOpen]
  )

  return (
    <MenuContainer
      isOpen={isOpen}
      style={{
        position: "absolute",
        top: position?.y,
        left: position?.x,
      }}
      ref={menuContainerRef}
    >
      {options.map((option) => (
        <Option
          form={form}
          name={name}
          option={option}
          optionContainer={optionContainer}
        />
      ))}
    </MenuContainer>
  )
}
