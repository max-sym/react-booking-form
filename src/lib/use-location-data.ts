import { useMemo, useRef, useState } from "react"
import debounce from "debounce-promise"

export const useLocationData = ({
  form,
  name,
  debounceDelay,
  formatResults,
}) => {
  const formSchemaItem = form?.formSchema?.[name]

  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState(
    formSchemaItem.options.defaultLocationOptions
  )

  const getPlaces = async (queryString) => {
    const options = formSchemaItem?.options
    if (!options?.searchPlace) return

    setIsLoading(true)
    return await options.searchPlace(queryString).then((results) => {
      setIsLoading(false)
      const options = formatResults?.(results) || results
      setOptions(options)
    })
  }

  const loadOptionsDebounce = useRef(
    debounce(getPlaces, debounceDelay, { leading: false })
  )

  const loadOptions = useRef((input) => loadOptionsDebounce.current(input))

  return useMemo(() => ({ options, isLoading, loadOptions }), [
    options,
    isLoading,
    loadOptions,
  ])
}
