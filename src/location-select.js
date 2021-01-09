import debounce from 'debounce-promise'
import React, { useRef, useState } from 'react'
import Select from 'react-select/async'

const defaultConvertResults = (results) => {
  return results.map((place) => ({
    value: place.place_id,
    label:
      place.structured_formatting.main_text +
      ' | ' +
      place.structured_formatting.secondary_text,
  }))
}

const defaultStyles = {
  control: (provided) => ({
    ...provided,
    cursor: 'pointer',
    padding: '0 8px',
    borderRadius: '100px',
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '24px',
  }),
  menuList: (provided) => ({
    ...provided,
    padding: 0,
    borderRadius: '24px',
  }),
  option: (provided) => ({
    ...provided,
    padding: '12px 18px',
    cursor: 'pointer',
  }),
}

const LocationSelect = ({
  onLocationChange,
  defaultOptions,
  DropdownIndicator = null,
  name = 'location',
  placeholder = 'Location',
  className,
  styles = defaultStyles,
  convertResults = defaultConvertResults,
  searchPlace,
  debounceDelay = 500,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const components = useMemo(
    () => ({
      DropdownIndicator,
      IndicatorSeparator: null,
    }),
    []
  )

  const getPlaces = async (queryString) => {
    setIsLoading(true)
    return await searchPlace(queryString).then((results) => {
      setIsLoading(false)
      return convertResults(results)
    })
  }

  const onChange = (value, { action }) => {
    if (action !== 'select-option') return

    onLocationChange({ value })
  }

  const loadOptionsDebounce = useRef(
    debounce(getPlaces, debounceDelay, { leading: false })
  )

  const loadOptions = useRef((input) => loadOptionsDebounce.current(input))

  return (
    <Select
      className={className}
      components={components}
      defaultOptions={defaultOptions}
      isLoading={isLoading}
      loadOptions={loadOptions.current}
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      styles={styles}
    />
  )
}

export default LocationSelect
