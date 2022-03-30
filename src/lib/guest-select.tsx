import React, { useEffect } from "react"
import { Popover, Portal } from "@headlessui/react"
import { BookingForm } from "./use-react-booking-form"
import { useSelectPopper } from "./use-select-popper"
import { mergeRefs } from "./utils"

export type OptionType = {
  name: string
  value: any
}

export type OffsetType = [number, number]

export type GuestSelectType = {
  form: BookingForm
  name: string
  menu: React.ElementType
  menuContainer: React.ElementType
  inputComponent: React.ElementType<any & { isLoading?: boolean }>
  placeholder?: string
  offset?: OffsetType
}

export const GuestSelect = ({
  form,
  name,
  menu: Menu,
  menuContainer: MenuContainer,
  inputComponent: InputComponent,
  placeholder,
  offset,
}: GuestSelectType) => {
  const formStateItem = form?.state?.[name]
  const { button, setButton, setPopper, styles, attributes } = useSelectPopper({
    offset,
  })

  useEffect(() => {
    //@ts-ignore
    form.refs[name].current = button
  }, [button])

  const onFocus = () => {
    button?.click()
  }

  const count = form.state[name].totalCount

  const val = count ? `${count} guest${count > 1 ? "s" : ""}` : ""

  return (
    <div className="relative">
      <Popover>
        {({ open }) => (
          <>
            <Popover.Button
              value={val}
              ref={setButton}
              onFocus={onFocus}
              as={InputComponent}
              placeholder={placeholder}
              readOnly
            />
            <Portal>
              <Popover.Panel
                as={MenuContainer}
                ref={setPopper}
                static
                style={styles.popper}
                {...attributes.popper}
              >
                <Menu
                  open={open}
                  options={formStateItem.value}
                  name={name}
                  form={form}
                />
              </Popover.Panel>
            </Portal>
          </>
        )}
      </Popover>
    </div>
  )
}
