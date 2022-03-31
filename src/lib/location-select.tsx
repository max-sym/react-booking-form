import React, { useEffect, useRef } from "react"
import { Combobox, Portal } from "@headlessui/react"
import { BookingForm } from "./use-react-booking-form"
import { useLocationData } from "./use-location-data"
import { useSelectPopper } from "./use-select-popper"
import { OffsetType } from "./guest-select"

export type SelectType = {
  formatResults?: any
  debounceDelay?: number
  form: BookingForm
  name: string
  menuContainer: React.ElementType
  menu: React.ElementType
  placeholder?: string
  inputComponent: React.ElementType<any & { isLoading?: boolean }>
  emptyOption?: any
  selectOnClick?: boolean
  autoComplete?: string
  option: React.ElementType<
    any & {
      $active?: boolean
      $selected?: boolean
      $disabled?: boolean
    }
  >
  /**
   * Popup window position offset
   */
  offset?: OffsetType
}

const ExtendedOption = ({
  active,
  selected,
  Option,
  onClick = undefined,
  form,
  element,
  name,
  option,
  ...props
}) => {
  const realOnClick = () => {
    form.setFieldState(name, { value: option })
    element?.focus?.()
    setTimeout(() => {
      const focusOnNext = form.formSchema[name].focusOnNext
      form.focusOn(focusOnNext)
    }, 100)
  }

  return (
    <Option
      $active={active}
      $selected={selected}
      onClick={realOnClick}
      {...props}
    >
      {option.label}
    </Option>
  )
}

export const LocationSelect = ({
  form,
  menu: Menu,
  menuContainer: MenuContainer,
  option: Option,
  inputComponent: InputComponent,
  emptyOption,
  debounceDelay = 500,
  selectOnClick = true,
  name,
  formatResults,
  autoComplete = "off",
  placeholder,
  offset,
}: SelectType) => {
  const formStateItem = form?.state?.[name]
  const {
    element,
    setElement,
    setPopper,
    styles,
    attributes,
  } = useSelectPopper({
    offset,
  })

  const btn = useRef<HTMLButtonElement | null>(null)

  const { loadOptions, isLoading, options } = useLocationData({
    debounceDelay,
    formatResults,
    name,
    form,
  })

  const onChange = (event: any) => {
    loadOptions.current(event.target.value)
  }

  const onSelect = (option) => {
    form.setFieldState(name, { value: option })
    setTimeout(() => {
      const focusOnNext = form.formSchema[name].focusOnNext
      if (!focusOnNext) return

      const formItem = form.formSchema[focusOnNext]
      if (formItem.type === "location")
        return form.refs[focusOnNext]?.current?.focus()

      form.focusOn(focusOnNext)
    }, 50)
  }

  const onFocus = () => {
    btn?.current?.click?.()
    if (selectOnClick) {
      element?.select?.()
    }
  }

  useEffect(() => {
    //@ts-ignore
    form.refs[name].current = element
  }, [element])

  return (
    <Combobox value={formStateItem.value} onChange={onSelect}>
      {({ open }) => (
        <>
          <Combobox.Button style={{ display: "none" }} ref={btn} />
          <Combobox.Input
            onFocus={onFocus}
            displayValue={(v: any) => v.label}
            onChange={onChange}
            ref={setElement}
            isLoading={isLoading}
            as={InputComponent}
            placeholder={placeholder}
            autoComplete={autoComplete}
            name={name}
            form={form}
          />
          <Portal>
            <Combobox.Options
              as={MenuContainer}
              ref={setPopper}
              static
              style={{ ...styles.popper, pointerEvents: open ? "" : "none" }}
              {...attributes.popper}
            >
              <Menu open={open}>
                {!options.length &&
                  (typeof emptyOption === "function" ? (
                    emptyOption()
                  ) : (
                    <Option $disabled>{emptyOption}</Option>
                  ))}
                {options.map((option) => (
                  <Combobox.Option
                    key={option.value}
                    value={option}
                    as={React.Fragment}
                  >
                    {({ active, selected }) => (
                      <ExtendedOption
                        active={active}
                        selected={selected}
                        option={option}
                        Option={Option}
                        form={form}
                        element={element}
                        name={name}
                      >
                        {option.label}
                      </ExtendedOption>
                    )}
                  </Combobox.Option>
                ))}
              </Menu>
            </Combobox.Options>
          </Portal>
        </>
      )}
    </Combobox>
  )
}
