import React, { useMemo, useRef, useState } from "react"
// import { InputCore, Text, Card, Transition } from "components"
import { Combobox, Portal } from "@headlessui/react"
import { usePopper } from "react-popper"
import { BookingForm } from "./use-react-booking-form"
import { useLocationData } from "./use-location-data"

export type OptionType = {
  name: string
  value: any
}

export type OffsetType = [number, number]

export type SelectType = {
  formatResults?: any
  debounceDelay?: number
  form: BookingForm
  name: string
  menuContainer: React.ElementType
  menu: React.ElementType
  button: React.ElementType
  placeholder?: string
  inputComponent: React.ElementType<any & { isLoading?: boolean }>
  emptyOption?: any
  option: React.ElementType<{
    $active?: boolean
    $selected?: boolean
    $disabled?: boolean
  }>
  offset?: OffsetType
}

const useSelectPopper = ({ offset = [0, 10] }: { offset?: OffsetType }) => {
  const [button, setButton] = useState<HTMLButtonElement | null>(null)
  const [popper, setPopper] = useState<HTMLUListElement | null>(null)

  const { styles, attributes } = usePopper(button, popper, {
    placement: "bottom",
    strategy: "fixed",
    modifiers: [{ name: "offset", options: { offset } }],
  })

  return useMemo(
    () => ({
      button,
      setButton,
      popper,
      setPopper,
      styles,
      attributes,
    }),
    [button, setButton, popper, setPopper, styles, attributes]
  )
}

export const LocationSelect = ({
  form,
  button: Button,
  menu: Menu,
  menuContainer: MenuContainer,
  option: Option,
  inputComponent: InputComponent,
  emptyOption,
  debounceDelay = 500,
  name,
  formatResults,
  placeholder,
  offset,
}: SelectType) => {
  const formStateItem = form?.state?.[name]
  const { setButton, setPopper, styles, attributes } = useSelectPopper({
    offset,
  })

  const btn = useRef<HTMLDivElement | null>(null)

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
  }

  const onInputClick = () => {
    btn?.current?.click?.()
  }

  return (
    <div className="relative">
      <Combobox value={formStateItem.value} onChange={onSelect}>
        {({ open }) => (
          <>
            <Combobox.Button as={Button} isLoading={isLoading} ref={btn} />
            <Combobox.Input
              displayValue={(v: any) => v.label}
              onChange={onChange}
              onClick={onInputClick}
              ref={setButton}
              as={InputComponent}
              placeholder={placeholder}
            />
            <Portal>
              <Combobox.Options
                as={MenuContainer}
                ref={setPopper}
                static
                style={styles.popper}
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
                        <Option $active={active} $selected={selected}>
                          {option.label}
                        </Option>
                      )}
                    </Combobox.Option>
                  ))}
                </Menu>
              </Combobox.Options>
            </Portal>
          </>
        )}
      </Combobox>
    </div>
  )
}
