import { useRef } from "react"
import {
  DateInput,
  GuestsSelect,
  LocationSelect,
  useReactBookingForm,
} from "../lib"
import tw from "twin.macro"
import { FaMapMarkerAlt } from "react-icons/fa"
import { IoCalendarClear } from "react-icons/io5"
import { HiOutlineSearch } from "react-icons/hi"
import { cities } from "./dummy-data/cities"

interface ButtonProps {}

const Container = tw.div`rounded-full bg-white p-6 shadow-xl flex justify-between flex-col md:flex-row md:space-x-2 md:space-y-0 space-y-2`
const FlatPickrInput = tw.input`border rounded-full w-full hover:text-blue-500 outline-none focus:border-blue-500 pl-4 pr-6`
const InputContainer = tw.div`relative w-full md:w-1/3 border-l-0 md:border-l pl-2 first:border-l-0`

const SearchIcon = tw(HiOutlineSearch)`text-white w-5 h-5`
const ButtonText = tw.div`ml-2`
const MainButton = tw.button`appearance-none border-0 w-full h-full rounded-full flex justify-center items-center bg-green-500 text-white font-bold px-3`
const CalendarIconContainer = tw.a`absolute top-0 right-0 bottom-0 h-full flex items-center pr-2 cursor-pointer`

const DatePicker = ({ ...props }) => (
  <DateInput
    className="relative flex h-full"
    iconComponent={
      <CalendarIconContainer>
        <IoCalendarClear />
      </CalendarIconContainer>
    }
    inputComponent={<FlatPickrInput />}
    {...props}
  />
)

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
  { value: "barcelona", label: "Barcelona" },
  { value: "new-york", label: "New York" },
  { value: "los-angeles", label: "Los Angeles" },
  { value: "san-francisco", label: "San Francisco" },
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

  const onSelectionComplete = () => {
    // window.location.href = `${resultsPageURL}?${convertFormToURLParams()}`
    console.log("a")
  }

  const {
    form,
    setFormFields,
    checkInOptions,
    checkOutOptions,
  } = useReactBookingForm({
    defaultForm,
    onSelectionComplete,
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
    <Container>
      <InputContainer>
        <LocationSelect
          className="w-full"
          defaultOptions={defaultOptions}
          dropdownComponent={FaMapMarkerAlt}
          name="location"
          onLocationChange={onLocationChange}
          placeholder="Location"
          searchPlace={searchPlace}
        />
      </InputContainer>
      <InputContainer>
        <DatePicker
          containerRef={checkInRef}
          onChange={onCheckInChange}
          options={checkInOptions}
          placeholder="Check in"
        />
      </InputContainer>
      <InputContainer>
        <DatePicker
          containerRef={checkOutRef}
          onChange={onCheckOutChange}
          options={checkOutOptions}
          placeholder="Check out"
        />
      </InputContainer>
      <InputContainer>
        <GuestsSelect
          containerRef={guestsRef}
          className="border rounded-full w-full h-full pl-4 hover:text-blue outline-none focus:border-blue-500"
        />
      </InputContainer>
      <InputContainer style={{ flexBasis: "38px", flexShrink: 0, flexGrow: 1 }}>
        <MainButton>
          <SearchIcon />
          <ButtonText>Search</ButtonText>
        </MainButton>
      </InputContainer>
    </Container>
  )
}
