import React, { useEffect } from "react"
import { Popover, Portal } from "@headlessui/react"
import {
  BookingForm,
  FormStateItem,
  GuestOption,
} from "./use-react-booking-form"
import { useSelectPopper } from "./use-select-popper"

export type OptionType = {
  name: string
  value: any
}

/**
 * Popup window position offset
 */
export type OffsetType = [number, number]

export type GuestSelectType = {
  form: BookingForm
  name: string
  menu: React.ElementType
  menuContainer: React.ElementType
  option: React.ElementType
  okButton?: React.ElementType
  okText?: string
  inputComponent: React.ElementType<any & { isLoading?: boolean }>
  placeholder?: string
  /**
   * Popup window position offset
   */
  offset?: OffsetType
  /**
   * The format of text to be displayed in the input component.
   * - "all" would show the text 1 guest, 2 guests, ...
   * - "each" would show `1 adults`, `2 adults | 2 children`, ...
   */
  countTextFormat?: CountTextFormat
}

type CountTextFormat = "all" | "each" | ((fieldItem?: FormStateItem) => string)

const getCountDisplayText = (
  fieldItem: FormStateItem,
  mode: CountTextFormat
) => {
  if (mode === "all") {
    const count = fieldItem?.totalCount
    return count ? `${count} guest${count > 1 ? "s" : ""}` : ""
  }
  if (mode === "each") {
    let result = ""

    // @ts-ignore
    fieldItem.value.forEach((value) => {
      const separator = result ? " | " : ""
      if (!value.value) return

      result = result.concat(`${separator}${value.value} ${value.name}`)
    })
    return result
  }
  return mode?.(fieldItem)
}

export const GuestSelect = ({
  form,
  name,
  menu: Menu,
  option: OptionComponent,
  menuContainer: MenuContainer,
  inputComponent: InputComponent,
  okButton: OkButton,
  okText = "Ok",
  placeholder,
  offset,
  countTextFormat = "all",
}: GuestSelectType) => {
  const formStateItem = form?.state?.[name]
  const options = formStateItem.value
  const {
    element,
    setElement,
    setPopper,
    styles,
    attributes,
  } = useSelectPopper({
    offset,
  })

  useEffect(() => {
    //@ts-ignore
    form.refs[name].current = element
  }, [element])

  const value = getCountDisplayText(form.state[name], countTextFormat)

  const onOkButtonClick = () => {
    element?.click()
  }

  return (
    <Popover as={React.Fragment}>
      {({ open }) => (
        <>
          <Popover.Button
            value={value}
            ref={setElement}
            as={InputComponent}
            placeholder={placeholder}
            name={name}
            form={form}
            readOnly
          />
          <Portal>
            <Popover.Panel
              as={MenuContainer}
              ref={setPopper}
              static
              style={{ ...styles.popper, pointerEvents: open ? "" : "none" }}
              {...attributes.popper}
            >
              <Menu open={open}>
                {/* @ts-ignore */}
                {options.map((option: GuestOption) => (
                  <OptionComponent
                    key={option.name}
                    form={form}
                    name={name}
                    option={option}
                  />
                ))}
                {!!OkButton && (
                  <OkButton onClick={onOkButtonClick}>{okText}</OkButton>
                )}
              </Menu>
            </Popover.Panel>
          </Portal>
        </>
      )}
    </Popover>
  )
}
