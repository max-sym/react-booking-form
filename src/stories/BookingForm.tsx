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
import styled from "@emotion/styled/macro"

const Container = tw.div`rounded-xl bg-white p-6 shadow-xl flex justify-between flex-col md:flex-row md:space-x-2 md:space-y-0 space-y-2`
const DateInputCore = tw.input`border rounded-full w-full outline-none transition pl-4 pr-6 group-hover:border-green-500`
const InputContainer = tw.div`relative w-full md:w-1/3 border-l-0 md:border-l pl-2 first:border-l-0`
const Label = tw.div`text-sm font-bold mb-1 text-gray-500`

const ButtonText = tw.div`ml-2`
const MainButton = tw.button`appearance-none border-0 w-full h-full rounded-full flex justify-center items-center bg-green-500 text-white font-bold px-3`
const CalendarIconContainer = tw.a`absolute top-0 right-0 bottom-0 h-full flex items-center pr-2 cursor-pointer text-gray-500`

const DatePickerInput = ({ placeholder }) => (
  <div className="relative flex group h-10">
    <DateInputCore type="input" data-input placeholder={placeholder} />
    <CalendarIconContainer title="toggle" data-toggle>
      <FaCalendarAlt />
    </CalendarIconContainer>
  </div>
)

const DatePicker = (props) => (
  <DateInput inputComponent={DatePickerInput} {...props} />
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

const MenuContainer = styled.div<any>(({ isOpen }) => [
  tw`w-64 h-64 border z-10 mt-12 transform transition ease-in-out bg-white rounded-xl overflow-hidden`,
  isOpen ? tw`opacity-100` : tw`opacity-0 -translate-y-4 pointer-events-none`,
])

const OptionContainer = tw.div`hover:bg-gray-300 cursor-pointer`

const InputComponent = ({ form, name, ...props }) => {
  return (
    <div>
      <input
        className="outline-none focus:outline-none"
        ref={form.refs[name]}
        {...props}
      />
    </div>
  )
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
        <Label>{"Location"}</Label>
        <LocationSelect
          form={form}
          menuContainer={MenuContainer}
          optionContainer={OptionContainer}
          inputComponent={InputComponent}
          name="location"
          placeholder="Type location..."
        />
      </InputContainer>
      <InputContainer>
        <Label>{"Check in"}</Label>
        <DatePicker placeholder="Add date" form={form} name={"checkIn"} />
      </InputContainer>
      <InputContainer>
        <Label>{"Check out"}</Label>
        <DatePicker placeholder="Add date" form={form} name={"checkOut"} />
      </InputContainer>
      <InputContainer>
        <Label>{"Guests"}</Label>
        <GuestsSelect
          styles={styles}
          form={form}
          placeholder="Add guests"
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
