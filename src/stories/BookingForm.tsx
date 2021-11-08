import React from "react"
import {
  DateInput,
  FormSchema,
  GuestsSelect,
  LocationSelect,
  useReactBookingForm,
} from "../lib"
import tw from "twin.macro"
import { FaMapMarkerAlt, FaCalendarAlt, FaSearch } from "react-icons/fa"
import { cities } from "./dummy-data/cities"

const Container = tw.div`rounded-xl bg-white p-6 shadow-xl flex justify-between flex-col md:flex-row md:space-x-2 md:space-y-0 space-y-2`
const DateInputCore = tw.input`border rounded-full w-full outline-none transition pl-4 pr-6 group-hover:border-green-500`
const InputContainer = tw.div`relative w-full md:w-1/3 border-l-0 md:border-l pl-2 first:border-l-0`

const ButtonText = tw.div`ml-2`
const MainButton = tw.button`appearance-none border-0 w-full h-full rounded-full flex justify-center items-center bg-green-500 text-white font-bold px-3`
const CalendarIconContainer = tw.a`absolute top-0 right-0 bottom-0 h-full flex items-center pr-2 cursor-pointer text-gray-500`

const DatePickerInput = (props) => (
  <>
    <DateInputCore {...props} />
    <CalendarIconContainer title={"toggle"} data-toggle>
      <FaCalendarAlt />
    </CalendarIconContainer>
  </>
)

const DatePicker = (props) => (
  <DateInput
    className="relative flex h-full group"
    inputComponent={<DatePickerInput />}
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

const defaultLocationOptions = [
  { value: "barcelona", label: "Barcelona" },
  { value: "new-york", label: "New York" },
  { value: "los-angeles", label: "Los Angeles" },
  { value: "san-francisco", label: "San Francisco" },
]

const searchPlace = async (queryString) => {
  const result = await dataProvider.searchPlace(queryString)
  return result
}

const formSchema: FormSchema = {
  location: {
    type: "location",
    focusOnNext: "checkIn",
    options: { defaultLocationOptions, searchPlace },
  },
  checkIn: {
    type: "date",
    focusOnNext: "checkOut",
    options: { minDate: "today", wrap: true },
  },
  checkOut: { type: "date", focusOnNext: "guests", options: { wrap: true } },
  guests: {
    type: "peopleCount",
    options: {
      min: 1,
      max: 10,
    },
  },
}

export const BookingForm = ({}) => {
  const form = useReactBookingForm({ formSchema })

  const components = {
    DropdownIndicator: () => <FaMapMarkerAlt className="text-gray-500" />,
    IndicatorSeparator: null,
    Control: React.forwardRef(({ children, innerProps }: any, ref) => (
      <div
        className="border cursor-pointer rounded-full w-full outline-none transition focus:border-green-500 hover:border-green-500 flex"
        {...innerProps}
        ref={ref}
      >
        {children}
      </div>
    )),
  }

  const styles = {
    menu: (provided) => ({
      ...provided,
      borderRadius: "20px",
      overflow: "hidden",
      cursor: "pointer",
    }),
  }

  return (
    <Container>
      <InputContainer>
        <LocationSelect
          form={form}
          components={components}
          name="location"
          placeholder="Type Location..."
          styles={styles}
        />
      </InputContainer>
      <InputContainer>
        <DatePicker placeholder="Check In" form={form} name={"checkIn"} />
      </InputContainer>
      <InputContainer>
        <DatePicker placeholder="Check Out" form={form} name={"checkOut"} />
      </InputContainer>
      <InputContainer>
        <GuestsSelect
          styles={styles}
          form={form}
          components={components}
          name={"guests"}
        />
      </InputContainer>
      <InputContainer>
        <MainButton>
          <FaSearch className="text-white w-3 h-3" />
          <ButtonText>{"Search"}</ButtonText>
        </MainButton>
      </InputContainer>
    </Container>
  )
}
