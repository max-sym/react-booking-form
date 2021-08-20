import { useRef } from "react"
import {
  DateInput,
  GuestsSelect,
  LocationSelect,
  useReactBookingForm,
} from "../lib"
import { FaMapMarkerAlt } from "react-icons/fa"
import { cities } from "./dummy-data/cities"

interface ButtonProps {}

const dataProvider = {
  searchPlace: async (queryString) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(
          cities
            .filter((city) =>
              city.toLowerCase().includes(queryString.toLowerCase())
            )
            .map((city) => ({ value: city.toLowerCase(), label: city }))
        )
      }, 100)
    })
  },
}

const defaultOptions = [
  { value: "lisbon", label: "Lisbon" },
  { value: "kiev", label: "Kiev" },
]

const defaultForm = {
  location: null,
  dateFrom: undefined,
  dateTo: undefined,
  guests: null,
}

/**
 * Primary UI component for user interaction
 */
export const Selector = ({}: ButtonProps) => {
  const checkInRef = useRef<any>()
  const checkOutRef = useRef<any>()
  const guestsRef = useRef<any>()

  const {
    form,
    setFormFields,
    goToResultsPage,
    checkInOptions,
    checkOutOptions,
  } = useReactBookingForm({
    defaultForm,
    resultsPageURL: "/rent",
  })

  const onLocationChange = ({ value }) => {
    setFormFields({ location: value })
    checkInRef.current.node.childNodes[0].focus()
  }

  const onCheckInChange = (value) => {
    setFormFields({ dateFrom: value })
    checkOutRef.current.node.childNodes[0].focus()
  }

  const onCheckOutChange = (value) => {
    setFormFields({ dateTo: value })
    guestsRef.current.focus()
  }

  const onGuestsSelectChange = (event) => {
    setFormFields({ guests: event.target.value })
  }

  const searchPlace = async (queryString) => {
    const result = await dataProvider.searchPlace(queryString)
    return result
  }

  return (
    <div>
      <LocationSelect
        className="w-full"
        defaultOptions={defaultOptions}
        dropdownComponent={FaMapMarkerAlt}
        name="location"
        onLocationChange={onLocationChange}
        placeholder="Location"
        searchPlace={searchPlace}
      />
      <GuestsSelect containerRef={guestsRef} />
    </div>
  )
}
