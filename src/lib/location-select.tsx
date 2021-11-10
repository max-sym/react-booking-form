import debounce from "debounce-promise"
import React, { useMemo, useRef, useState } from "react"
import { Portal } from "./portal"
import { BookingForm } from "./use-react-booking-form"

const Option = ({
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

const Menu = ({
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

export type LocationSelectProps = {
  formatResults?: any
  debounceDelay?: number
  form: BookingForm
  name: string
  menuContainer: any
  optionContainer: any
  inputComponent: any
}

export const LocationSelect = ({
  formatResults,
  debounceDelay = 500,
  name,
  form,
  menuContainer,
  optionContainer,
  inputComponent: InputComponent,
  ...props
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
      return formatResults?.(results) || results
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
        type="text"
        spellCheck="false"
        {...props}
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
