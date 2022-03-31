import React, { useCallback, useMemo, useState } from "react"

export type LocationOption = {
  label: string
  value: string
}

export type FieldValue = LocationOption | Date | GuestOption[] | string

export type FieldType = "location" | "date" | "datetime" | "peopleCount"

export type FormSchema = {
  [key: string]: {
    type: FieldType
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
  /**
   * Form schema provided by the user.
   */
  formSchema: FormSchema
  /**
   * Current form state.
   */
  state: FormState
  setState: (state: FormState) => void
  /**
   * Helper that sets the particular field value in the form.
   */
  setFieldValue: (key: string, value: any) => void
  /**
   * Helper that sets the particular field state in the form.
   */
  setFieldState: (key: string, fieldState: any) => void
  /**
   * An array of references to the form fields.
   * This can be used to focus on a particular field and do other relevant actions.
   */
  refs: RefsType
  /**
   * Helper that allows to focus on a particular field just by passing field key to it.
   */
  focusOn: (key?: string) => void
  /**
   * This is a helper that allows to change a particular option item state.
   * For example, if you want to increment the number of "adults", you can use this helper as:
   * ```
   * form.setGuestOptionValue(name, option, option.value + 1)
   * ```
   */
  setGuestOptionValue: (key: string, option: any, value: any) => void
  /**
   * A callback to pass to the guest minus button click event.
   */
  onMinusClick: (option: GuestOption, name: string) => () => void
  /**
   * A callback to pass to the guest plus button click event.
   */
  onPlusClick: (option: GuestOption, name: string) => () => void
  /**
   * A callback to pass to the guest buttons to determine if the buttons are disabled.
   */
  getIsOptionDisabled: (
    option: GuestOption,
    optionType: "plus" | "minus"
  ) => boolean
  /**
   * This can be used to swap the location fields.
   */
  swapLocations: (fieldKeys?: [string, string] | undefined) => void
  /**
   * Converts the form state to url query string.
   * Use convertDate to convert dates to the desired format.
   */
  serializeToURLParams: ({
    convertDate,
  }: {
    convertDate?: (dateValue: Date) => any
  }) => string
}

export type RefsType = {
  [key: string]: React.RefObject<HTMLElement>
}

export type FormStateItem = {
  type: FieldType
  value: FieldValue
  /**
   * Stores total number of guests in guest selector.
   */
  totalCount?: number
}

export type FormState = {
  [key: string]: FormStateItem
}

const getFieldKeysToSwap = (formState: FormState) => {
  const firstLocation = Object.keys(formState).find(
    (key) => formState[key].type === "location"
  )
  const secondLocation = Object.keys(formState).find(
    (key) => key !== firstLocation && formState[key].type === "location"
  )

  if (!firstLocation || !secondLocation) return null

  return [firstLocation, secondLocation]
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
    setState((state) => ({ ...state, [key]: { ...state[key], value } }))
  }, [])

  const setFieldState = useCallback((key: string, fieldState: any) => {
    setState((state) => ({ ...state, [key]: { ...state[key], ...fieldState } }))
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
    [state]
  )

  const onMinusClick = useCallback(
    (option: GuestOption, name: string) => () => {
      setGuestOptionValue(name, option, option.value - 1)
    },
    [setGuestOptionValue]
  )

  const onPlusClick = useCallback(
    (option: GuestOption, name: string) => () => {
      setGuestOptionValue(name, option, option.value + 1)
    },
    [setGuestOptionValue]
  )

  const getIsOptionDisabled = useCallback(
    (option: GuestOption, optionButtonType: "plus" | "minus") =>
      optionButtonType === "plus"
        ? option.value >= (option.max || 100)
        : option.value === 0,
    []
  )

  const swapLocations = useCallback(
    (fieldKeys?: [string, string]) => {
      const fieldKeysToSwap =
        fieldKeys?.length === 2 ? fieldKeys : getFieldKeysToSwap(state)

      if (!fieldKeysToSwap) return

      // swap locations in state
      setFieldState(fieldKeysToSwap[0], state[fieldKeysToSwap[1]])
      setFieldState(fieldKeysToSwap[1], state[fieldKeysToSwap[0]])
    },
    [state]
  )

  const serializeToURLParams = useCallback(
    ({ convertDate }: { convertDate?: (dateValue: Date) => any }) => {
      const params = {}
      Object.keys(state).forEach((key) => {
        const field = state[key]

        let value = ""
        if (field.type === "date") {
          value = convertDate ? convertDate(field.value[0]) : field.value[0]
        }
        if (field.type === "peopleCount") {
          // @ts-ignore
          field.value.forEach((option) => {
            params[`${key}-${option.name}`] = option.value
          })
          return
        }
        if (field.type === "location") {
          // @ts-ignore
          value = field.value.value
        }
        params[key] = value
      })
      return new URLSearchParams(params).toString()
    },
    [state]
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
      onMinusClick,
      onPlusClick,
      getIsOptionDisabled,
      swapLocations,
      serializeToURLParams,
    }),
    [
      formSchema,
      state,
      setState,
      refs,
      setFieldValue,
      focusOn,
      setFieldState,
      onMinusClick,
      onPlusClick,
      getIsOptionDisabled,
      swapLocations,
      serializeToURLParams,
    ]
  )
  return bookingForm
}
