import React, { useCallback, useMemo, useState } from "react"

export type LocationOption = {
  label: string
  value: string
}

export type FieldValue = LocationOption | GuestOption[] | string

export type FormSchema = {
  [key: string]: {
    type: "location" | "date" | "datetime" | "peopleCount"
    focusOnNext?: string
    defaultValue?: FieldValue
    options?: {
      defaultLocationOptions?: LocationOption[]
      searchPlace?: (queryString: string) => Promise<any>
      [key: string]: any
    }
  }
}

export type GuestOption = {
  label: string
  value: number
  totalCount?: number
  name: string
  min: number
  max: number
  [key: string]: any
}

const getGuestTotalCount = (guestOptions: GuestOption[]) =>
  guestOptions.reduce((acc, guestOption) => acc + guestOption.value, 0)

export type BookingForm = {
  formSchema: FormSchema
  state: FormState
  setState: (state: FormState) => void
  setFieldValue: (key: string, value: any) => void
  setFieldState: (key: string, state: any) => void
  refs: RefsType
  focusOn: (key?: string) => void
  setGuestOptionValue: (key: string, option: any, value: any) => void
}

export type RefsType = {
  [key: string]: React.RefObject<HTMLElement>
}

export type FormState = {
  [key: string]: {
    type: string
    value: FieldValue
    isOpen?: boolean
    totalCount?: number
  }
}

export const useReactBookingForm = ({
  formSchema,
}: {
  formSchema: FormSchema
}) => {
  const [state, setState] = useState<FormState>(() => {
    const result = {}
    Object.keys(formSchema).forEach((key) => {
      const field = formSchema[key]
      result[key] = {
        type: field.type,
        value: field.defaultValue,
        totalCount:
          field.type === "peopleCount"
            ? getGuestTotalCount(field.defaultValue as GuestOption[])
            : undefined,
      }
    })
    return result
  })

  const refs: RefsType = useMemo(() => {
    return Object.keys(formSchema).reduce((acc, key) => {
      acc[key] = React.createRef<any>()
      return acc
    }, {})
  }, [])

  const focusOn = useCallback(
    (name?: string) => {
      if (!name) return

      if (state[name].type === "date") {
        let child = refs[name].current?.querySelector("[data-input]")
        /**
         * This is created to avoid not focusing on the input when the datepicker has altInput + altFormat prop
         * The prop makes it so that the input is not accessible and is visually replaced by another input.
         */
        if (child?.getAttribute("type") === "hidden") {
          child = refs[name].current?.querySelector(".form-control.input")
        }

        // @ts-ignore
        child?.focus()
        return
      }

      if (!refs[name].current?.focus) return
      refs[name].current?.focus?.()
    },
    [refs]
  )

  const setFieldValue = useCallback((key: string, value: any) => {
    setState((field) => ({ ...field, [key]: { ...field[key], value } }))
  }, [])

  const setFieldState = useCallback((key: string, state: any) => {
    setState((field) => ({ ...field, [key]: { ...field[key], ...state } }))
  }, [])

  const setGuestOptionValue = useCallback(
    (key: string, option: GuestOption, value: number) => {
      const newStateItemValue = [...(state[key].value as GuestOption[])]
      const optionIndex = newStateItemValue.findIndex(
        (stateItemValue) => option.name === stateItemValue.name
      )
      newStateItemValue[optionIndex].value = value
      setFieldState(key, {
        value: newStateItemValue,
        totalCount: getGuestTotalCount(newStateItemValue),
      })
    },
    []
  )

  const bookingForm = useMemo<BookingForm>(
    () => ({
      formSchema,
      state,
      setState,
      setFieldValue,
      setFieldState,
      refs,
      focusOn,
      setGuestOptionValue,
    }),
    [formSchema, state, setState, refs, setFieldValue, focusOn, setFieldState]
  )
  return bookingForm
}
