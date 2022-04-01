import {
  DateInput,
  FormSchema,
  GuestSelect,
  GuestOption,
  LocationSelect,
  useReactBookingForm,
  BookingForm as BookingFormType,
  LocationOption,
} from "../lib"
import tw from "tailwind-styled-components"
import moment from "moment"
import { FaMapMarkerAlt } from "@react-icons/all-files/fa/FaMapMarkerAlt"
import { FaCalendarAlt } from "@react-icons/all-files/fa/FaCalendarAlt"
import { FaSpinner } from "@react-icons/all-files/fa/FaSpinner"
import { FaPlus } from "@react-icons/all-files/fa/FaPlus"
import { FaMinus } from "@react-icons/all-files/fa/FaMinus"
import { FaUser } from "@react-icons/all-files/fa/FaUser"
import { IoMdSwap } from "@react-icons/all-files/io/IoMdSwap"
import { cities } from "./dummy-data/cities"
import React from "react"

const Container = tw.div`md:rounded-full rounded-xl bg-white p-6 shadow-xl flex justify-between flex-col md:flex-row md:space-x-2 md:space-y-0 space-y-2 border border-gray-300`
const InputCore = tw.input`relative w-full peer flex h-10 focus:outline-none appearance-none border border-gray-300 rounded-full outline-none transition pl-4 pr-6 group-hover:border-green-500 focus:border-green-500 cursor-pointer`
const InputContainer = tw.div`relative w-full md:w-1/3 flex flex-col justify-center items-center pl-2`
const Label = tw.div`text-sm w-full font-bold mb-1 text-gray-500`

const ButtonCore = tw.button`appearance-none h-10 rounded-full flex justify-center items-center font-bold px-3`
const SwapButton = tw(ButtonCore)`
md:mt-5 border md:w-full border-gray-300 hover:border-green-500 hover:text-green-500 focus:border-green-500 focus:text-green-500 transition outline-none`

const PrimaryButton = tw(ButtonCore)`
border-0 bg-green-500 text-white uppercase`
const GuestOkButton = tw(PrimaryButton)`mx-auto w-5/6 mb-2`
const SearchButton = tw(PrimaryButton)`w-full mt-5`
const IconContainer = tw.a`z-20 absolute top-0 right-0 bottom-0 h-full flex items-center pr-2 cursor-pointer group-hover:text-green-500 peer-focus:text-green-500 text-gray-500 transition`

const MenuContainer = tw.div`z-20`
const Menu = tw.ul<{ open: boolean }>`
  w-64 max-h-[240px] border z-20 shadow-lg transform transition ease-in-out bg-white rounded-3xl overflow-y-auto overflow-x-hidden
  ${({ open }) => (open ? "" : "opacity-0 -translate-y-4 pointer-events-none")}
`
const Text = tw.p`text-sm font-bold text-gray-700 font-title`
const SmallText = tw.p`text-sm text-gray-500`

const OptionBase = tw.div`transition ease-in-out relative py-2 px-4`
const OptionContainer = tw(OptionBase)<{
  $active?: boolean
  $selected?: boolean
}>`cursor-pointer transition ${({ $active, $selected }) =>
  $active || $selected ? "bg-green-100" : ""}`
const GuestButton = tw.button`appearance-none rounded-full p-2 flex items-center justify-center h-full overflow-hidden border border-gray-500 text-gray-500 hover:text-white hover:bg-green-500 hover:border-transparent transition ease-in-out disabled:opacity-50`

type InputProps = {
  form?: BookingFormType
  isLoading?: boolean
  name?: string
  containerRef?: React.RefObject<HTMLDivElement>
}

const iconsList = {
  location: FaMapMarkerAlt,
  date: FaCalendarAlt,
  peopleCount: FaUser,
}

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  ({ isLoading, containerRef, form, name, ...props }, ref) => {
    const itemType = name && form?.formSchema[name].type
    const InputIcon = isLoading ? FaSpinner : iconsList[itemType || "location"]

    return (
      <div className="relative w-full group" ref={containerRef}>
        <InputCore data-input ref={ref} name={name} {...props} />
        <IconContainer title="toggle" data-toggle>
          <InputIcon className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </IconContainer>
      </div>
    )
  }
)

const GuestOptionComponent = ({
  form,
  name,
  option,
}: {
  form: BookingFormType
  name: string
  option: GuestOption
}) => (
  <OptionBase className="flex items-center justify-between">
    <div>
      <Text>{option.label}</Text>
      <SmallText>{option.description}</SmallText>
    </div>
    <div className="flex items-center justify-center gap-x-2">
      <GuestButton
        onClick={form.onPlusClick(option, name)}
        disabled={form.getIsOptionDisabled(option, "plus")}
      >
        <FaPlus className="w-3 h-3" />
      </GuestButton>
      <Text>{option.value}</Text>
      <GuestButton
        onClick={form.onMinusClick(option, name)}
        disabled={form.getIsOptionDisabled(option, "minus")}
      >
        <FaMinus className="w-3 h-3" />
      </GuestButton>
    </div>
  </OptionBase>
)

const formattedCities = cities.map((city) => ({
  value: city.toLowerCase(),
  label: city,
}))

const filterAndMapCiies = (query: string) =>
  formattedCities.filter((city) => city.value.includes(query.toLowerCase()))

const searchPlace = async (query: string) =>
  new Promise((resolve, _reject) => {
    setTimeout(() => resolve(filterAndMapCiies(query)), 600)
  })

const defaultLocationOptions: LocationOption[] = formattedCities.slice(0, 5)

const dateConfig = {
  altInput: true,
  altFormat: "M j, Y",
  dateFormat: "Y-m-d",
  wrap: true,
}

const formSchema: FormSchema = {
  from: {
    type: "location",
    options: { defaultLocationOptions, searchPlace },
    focusOnNext: "to",
  },
  to: {
    type: "location",
    options: { defaultLocationOptions, searchPlace },
    focusOnNext: "checkIn",
  },
  checkIn: {
    type: "date",
    focusOnNext: "checkOut",
    options: { ...dateConfig, minDate: "today" },
  },
  checkOut: {
    type: "date",
    focusOnNext: "guests",
    options: { ...dateConfig, minDateFrom: "checkIn" },
  },
  guests: {
    type: "peopleCount",
    defaultValue: [
      {
        name: "adults",
        label: "Adults",
        description: "Ages 13+",
        value: 1,
        min: 0,
        max: 10,
      },
      {
        name: "children",
        label: "Children",
        description: "Ages 4-12",
        value: 0,
        min: 0,
        max: 10,
      },
      {
        name: "infants",
        label: "Infants",
        description: "Under 4 years old",
        value: 0,
        min: 0,
        max: 10,
      },
    ],
  },
}

export const BookingForm = () => {
  const form = useReactBookingForm({ formSchema })

  const onBookButtonClick = () => {
    const config = {
      convertDate: (dateValue: Date) => moment(dateValue).format("DD-MM-YYYY"),
    }
    alert(form.serializeToURLParams(config))
  }

  return (
    <Container>
      <InputContainer>
        <Label>{"From"}</Label>
        <LocationSelect
          form={form}
          menu={Menu}
          menuContainer={MenuContainer}
          option={OptionContainer}
          inputComponent={InputComponent}
          name="from"
          emptyOption="Nothing was found :("
          placeholder="Where are you going?"
        />
      </InputContainer>
      <InputContainer style={{ width: "auto" }}>
        <SwapButton
          title="Swap Locations"
          aria-label="Swap Locations"
          onClick={() => form.swapLocations()}
        >
          <IoMdSwap className="w-4 h-4" />
        </SwapButton>
      </InputContainer>
      <InputContainer>
        <Label>{"To"}</Label>
        <LocationSelect
          form={form}
          menu={Menu}
          menuContainer={MenuContainer}
          option={OptionContainer}
          inputComponent={InputComponent}
          name="to"
          emptyOption="Nothing was found :("
          placeholder="Where are you going?"
        />
      </InputContainer>
      <InputContainer>
        <Label>{"Check in"}</Label>
        <DateInput
          inputComponent={InputComponent}
          className="w-full"
          placeholder="Add date"
          form={form}
          name="checkIn"
        />
      </InputContainer>
      <InputContainer>
        <Label>{"Check out"}</Label>
        <DateInput
          inputComponent={InputComponent}
          className="w-full"
          placeholder="Add date"
          form={form}
          name="checkOut"
        />
      </InputContainer>
      <InputContainer>
        <Label>{"Guests"}</Label>
        <GuestSelect
          form={form}
          menuContainer={MenuContainer}
          menu={Menu}
          inputComponent={InputComponent}
          option={GuestOptionComponent}
          okButton={GuestOkButton}
          okText="Ok!"
          placeholder="Add guests"
          name={"guests"}
        />
      </InputContainer>
      <InputContainer>
        <SearchButton onClick={onBookButtonClick}>{"Search"}</SearchButton>
      </InputContainer>
    </Container>
  )
}
