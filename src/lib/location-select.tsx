import React, { useEffect, useRef, useState } from "react"
import { Combobox, Portal } from "@headlessui/react"
import { BookingForm } from "./use-react-booking-form"
import { useLocationData } from "./use-location-data"
import { useSelectPopper } from "./use-select-popper"
import { OffsetType, OptionType } from "./guest-select"

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
  selectOnClick?: boolean
  autoComplete?: string
  option: React.ElementType<{
    $active?: boolean
    $selected?: boolean
    $disabled?: boolean
  }>
  offset?: OffsetType
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
  selectOnClick = true,
  name,
  formatResults,
  autoComplete = "off",
  placeholder,
  offset,
}: SelectType) => {
  const formStateItem = form?.state?.[name]
  const { button, setButton, setPopper, styles, attributes } = useSelectPopper({
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

  // const onSelect = (option, p) => {
  //   form.setFieldState(name, { value: option })
  //   setTimeout(() => {
  //     form.focusOn(form.formSchema[name].focusOnNext)
  //   }, 200)
  // }

  const onSelect = (option) => {
    form.setFieldState(name, { value: option })
    setTimeout(() => {
      const focusOnNext = form.formSchema[name].focusOnNext
      if (!focusOnNext) return

      const formItem = form.formSchema[focusOnNext]
      if (formItem.type === "location")
        return form.refs[focusOnNext]?.current?.click()

      form.focusOn(focusOnNext)
    }, 50)
  }

  const onClick = () => {
    // if (isOpen) {
    // setIsOpen(false)
    // }
    btn?.current?.click?.()
    // if (selectOnClick) {
    //   button?.select?.()
    // }
  }

  const onFocus = (event) => {
    // console.log("focus-" + name, open)
    // btn?.current?.click?.()
    // setIsOpen((i) => !i)
    if (selectOnClick) {
      button?.select?.()
    }
  }

  const onOptionClick = (open) => () => {
    // console.log("oc-" + name, open)
  }

  useEffect(() => {
    //@ts-ignore
    form.refs[name].current = button
  }, [button])

  const RealOption = ({ active, selected, option, onClick, btn, ...props }) => {
    // const realOnClick = () => {
    //   form.setFieldState(name, { value: option })
    //   onClick()
    //   // form.focusOn(form.formSchema[name].focusOnNext)
    //   // btn?.current?.click?.()
    // }

    return (
      <Option
        $active={active}
        $selected={selected}
        onClick={onClick}
        {...props}
      >
        {option.label}
      </Option>
    )
  }

  return (
    <div className="relative">
      <Combobox value={formStateItem.value} onChange={onSelect}>
        {({ open }) => (
          <>
            <Combobox.Button as={Button} isLoading={isLoading} ref={btn} />
            <Combobox.Input
              onClick={onClick}
              onFocus={onFocus}
              displayValue={(v: any) => v.label}
              onChange={onChange}
              ref={setButton}
              as={InputComponent}
              placeholder={placeholder}
              autoComplete={autoComplete}
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
                        <RealOption
                          $active={active}
                          $selected={selected}
                          option={option}
                        >
                          {option.label}
                        </RealOption>
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
