import React, { useCallback, useMemo, useRef, useState } from "react"

export type LocationItem = {
  label: string
  value: string
}

export type FormSchema = {
  [key: string]: {
    type: "location" | "date" | "datetime" | "peopleCount"
    focusOnNext?: string
    options?: {
      defaultLocationOptions?: LocationItem[]
      searchPlace?: (queryString: string) => Promise<any>
    }
  }
}

export type BookingForm = ReturnType<typeof useReactBookingForm>
// get refs type from const refs useMemo return below
export type RefsType = {
  [key: string]: React.RefObject<any>
}

export const useReactBookingForm = ({
  formSchema,
}: {
  formSchema: FormSchema
}) => {
  const [data, setData] = useState<FormSchema>(formSchema)

  const refs: RefsType = useMemo(() => {
    return Object.keys(formSchema).reduce((acc, key) => {
      acc[key] = React.createRef<any>()
      return acc
    }, {})
  }, [])

  const focusOn = useCallback(
    (name?: string) => {
      if (!name || !refs?.[name]?.current?.node) return

      refs[name].current?.node?.childNodes?.[0]?.focus?.()
    },
    [refs]
  )

  const setFieldValue = useCallback((key: string, value: any) => {
    setData((data) => ({ ...data, [key]: { ...data[key], value } }))
  }, [])

  return useMemo(
    () => ({
      data,
      setData,
      setFieldValue,
      refs,
      focusOn,
    }),
    [data, refs, setData, setFieldValue, focusOn]
  )
}
