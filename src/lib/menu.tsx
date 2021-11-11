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
  options: any
  isOpen: boolean
  form: any
  name: string
  menuContainerRef: any
  optionComponent?: React.ComponentType<any>
}) => {
  const position = useMemo(
    () => form.refs[name]?.current?.getBoundingClientRect?.(),
    [isOpen]
  )

  const RealOptionContainer = useMemo(() => OptionComponent || Option, [
    OptionComponent,
  ])

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
        <RealOptionContainer
          form={form}
          name={name}
          option={option}
          optionContainer={optionContainer}
        />
      ))}
    </MenuContainer>
  )
}
