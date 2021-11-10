import React from "react"
import {
  DateInput,
  FormSchema,
  GuestsSelect,
  LocationSelect,
  useReactBookingForm,
} from "../lib"
import tw from "twin.macro"
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaSearch,
  FaSpinner,
} from "react-icons/fa"
import { cities } from "./dummy-data/cities"
import styled from "@emotion/styled/macro"

const Container = tw.div`rounded-xl bg-white p-6 shadow-xl flex justify-between flex-col md:flex-row md:space-x-2 md:space-y-0 space-y-2`
const InputCore = tw.input`border rounded-full w-full outline-none transition pl-4 pr-6 group-hover:border-green-500 focus:border-green-500 cursor-pointer`
const InputContainer = tw.div`relative w-full md:w-1/3 border-l-0 flex flex-col justify-center items-center md:border-l pl-2 first:border-l-0`
const Label = tw.div`text-sm w-full font-bold mb-1 text-gray-500`

const ButtonText = tw.div`ml-2`
const MainButton = tw.button`appearance-none border-0 w-full h-10 rounded-full flex justify-center items-center bg-green-500 text-white font-bold px-3`
const IconContainer = tw.a`absolute top-0 right-0 bottom-0 h-full flex items-center pr-2 cursor-pointer text-gray-500`

const DatePickerInput = ({ placeholder }) => (
  <div className="relative flex group h-10 w-full">
    <InputCore type="input" data-input placeholder={placeholder} />
    <IconContainer title="toggle" data-toggle>
      <FaCalendarAlt className="w-4 h-4" />
    </IconContainer>
  </div>
)

const InputComponent = ({ form, name, isLoading, ...props }) => (
  <div className="relative flex group h-10 w-full">
    <InputCore
      className="outline-none focus:outline-none"
      ref={form.refs[name]}
      {...props}
    />
    <IconContainer>
      {isLoading ? (
        <FaSpinner className="w-4 h-4 animate-spin" />
      ) : (
        <FaMapMarkerAlt className="w-4 h-4" />
      )}
    </IconContainer>
  </div>
)

const DatePicker = (props) => (
  <DateInput className="w-full" inputComponent={DatePickerInput} {...props} />
)

const searchPlace = async (queryString) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(
        cities
          .filter((city) =>
            city.toLowerCase().includes(queryString.toLowerCase())
          )
          .map((city) => ({ value: city.toLowerCase(), label: city }))
      )
    }, 1000)
  })
}

const defaultLocationOptions = [
  { value: "new-york", label: "New York" },
  { value: "barcelona", label: "Barcelona" },
  { value: "los-angeles", label: "Los Angeles" },
]

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
  tw`w-64 h-64 border z-10 mt-12 transform transition ease-in-out bg-white rounded-3xl overflow-hidden`,
  isOpen ? tw`opacity-100` : tw`opacity-0 -translate-y-4 pointer-events-none`,
])
const OptionContainer = tw.div`cursor-pointer p-2 hover:bg-green-100 transition ease-in-out`

export const BookingForm = () => {
  const form = useReactBookingForm({ formSchema })

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
          inputProps={{
            placeholder: "Where are you going?",
          }}
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
        <GuestsSelect form={form} placeholder="Add guests" name={"guests"} />
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
