import React, { useCallback, useMemo, useState } from "react"

export type LocationItem = {
  label: string
  value: string
}

export type FormSchema = {
  [key: string]: {
    type: "location" | "date" | "datetime" | "peopleCount"
    focusOnNext?: string
    defaultValue?: any
    options?: {
      defaultLocationOptions?: LocationItem[]
      searchPlace?: (queryString: string) => Promise<any>
    } & any
  }
}

export type BookingForm = {
  formSchema: FormSchema
  state: FormState
  setState: (state: FormState) => void
  setFieldValue: (key: string, value: any) => void
  setFieldState: (key: string, state: any) => void
  refs: RefsType
  focusOn: (key?: string) => void
}

export type RefsType = {
  [key: string]: React.RefObject<any>
}

export type FormState = {
  [key: string]: { type: string; value: any; isOpen?: boolean }
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
      result[key] = { type: field.type, value: field.defaultValue }
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

      // This is here because flatpickr requires current.node to be focused on
      if (state[name]?.type === "date") {
        if (!refs?.[name]?.current?.node) return
        refs[name].current.node.querySelector("[data-input]")?.focus?.()
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

  const bookingForm = useMemo<BookingForm>(
    () => ({
      formSchema,
      state,
      setState,
      setFieldValue,
      setFieldState,
      refs,
      focusOn,
    }),
    [formSchema, state, setState, refs, setFieldValue, focusOn, setFieldState]
  )
  return bookingForm
}
