import {
  DateInput,
  FormSchema,
  GuestsSelect,
  LocationSelect,
  useReactBookingForm,
  BookingForm as BookingFormType,
} from "../lib"
import tw from "tailwind-styled-components"
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaSearch,
  FaSpinner,
  FaPlus,
  FaMinus,
  FaUser,
} from "react-icons/fa"
import { cities } from "./dummy-data/cities"

const Container = tw.div`rounded-full bg-white p-6 shadow-xl flex justify-between flex-col md:flex-row md:space-x-2 md:space-y-0 space-y-2`
const InputCore = tw.input`appearance-none border rounded-full w-full outline-none transition pl-4 pr-6 group-hover:border-green-500 focus:border-green-500 cursor-pointer`
const ControlCore = tw.div`appearance-none border rounded-full w-full outline-none transition pl-4 pr-6 group-hover:border-green-500 focus:border-green-500 cursor-pointer flex items-center`
const Placeholder = tw.div`text-gray-400 select-none`
const InputContainer = tw.div`relative w-full md:w-1/3 border-l-0 flex flex-col justify-center items-center md:border-l pl-2 first:border-l-0`
const Label = tw.div`text-sm w-full font-bold mb-1 text-gray-500`

const ButtonText = tw.div`ml-2`
const MainButton = tw.button`appearance-none mt-5 border-0 w-full h-10 rounded-full flex justify-center items-center bg-green-500 text-white font-bold px-3`
const IconContainer = tw.a`absolute top-0 right-0 bottom-0 h-full flex items-center pr-2 cursor-pointer text-gray-500 group-hover:text-green-400 transition`

const MenuContainer = tw.div<{ isOpen: boolean }>`
  w-64 max-h-[240px] border z-10 mt-12 transform transition ease-in-out bg-white rounded-3xl overflow-y-auto overflow-x-hidden
  ${({ isOpen }) =>
    isOpen ? "opacity-100" : "opacity-0 -translate-y-4 pointer-events-none"}
`

const OptionBase = tw.div`transition ease-in-out relative py-2 px-4`
const OptionContainer = tw(OptionBase)`hover:bg-green-100 cursor-pointer`

const DatePickerInput = ({ placeholder, inputRef }) => (
  <div className="relative flex w-full h-10 group" ref={inputRef}>
    <input
      className="w-full pl-4 pr-6 transition border rounded-full outline-none appearance-none cursor-pointer group-hover:border-green-500 focus:border-green-500"
      type="input"
      data-input
      placeholder={placeholder}
    />
    <IconContainer title="toggle" data-toggle>
      <FaCalendarAlt className="w-4 h-4" />
    </IconContainer>
  </div>
)

const InputComponent = ({ form, name, isLoading, ...props }) => (
  <div className="relative flex w-full h-10 group">
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

const ControlComponent = ({
  form,
  name,
  placeholder,
  ...props
}: {
  form: BookingFormType
  name: string
  placeholder?: string
}) => {
  const count = form.state[name].totalCount

  return (
    <div className="relative flex w-full h-10 group">
      <ControlCore
        className="outline-none focus:outline-none"
        ref={form.refs[name] as any}
        tabIndex={-1}
        {...props}
      >
        <p>{count ? `${count} guest${count > 1 ? "s" : ""}` : ""} </p>
        <Placeholder>{count ? "" : placeholder}</Placeholder>
      </ControlCore>
      <IconContainer>
        <FaUser className="w-4 h-4" />
      </IconContainer>
    </div>
  )
}

const GuestButton = tw.button`appearance-none rounded-full p-2 flex items-center justify-center h-full overflow-hidden border border-gray-500 text-gray-500 hover:text-white hover:bg-green-500 hover:border-transparent transition ease-in-out disabled:opacity-50`

const OptionComponent = ({
  form,
  name,
  option,
}: {
  form: BookingFormType
  name: string
  option: any
}) => {
  const onPlusClick = () => {
    form.setGuestOptionValue(name, option, option.value + 1)
  }

  const onMinusClick = () => {
    form.setGuestOptionValue(name, option, option.value - 1)
  }

  return (
    <OptionBase className="flex items-center justify-between">
      <div>
        <p className="text-sm font-bold text-gray-700 font-title">
          {option.label}
        </p>
        <p className="text-sm text-gray-500">{option.description}</p>
      </div>
      <div className="flex items-center justify-center gap-x-2">
        <GuestButton
          onClick={onPlusClick}
          disabled={option.value >= (option.max || 100)}
        >
          <FaPlus className="w-3 h-3" />
        </GuestButton>
        <p className="text-sm font-bold text-gray-700 font-title">
          {option.value}
        </p>
        <GuestButton onClick={onMinusClick} disabled={option.value === 0}>
          <FaMinus className="w-3 h-3" />
        </GuestButton>
      </div>
    </OptionBase>
  )
}

const DatePicker = (props) => (
  <DateInput className="w-full" inputComponent={DatePickerInput} {...props} />
)

const filterAndMapCiies = (query) =>
  cities
    .filter((city) => city.toLowerCase().includes(query.toLowerCase()))
    .map((city) => ({ value: city.toLowerCase(), label: city }))

const searchPlace = async (query) =>
  new Promise((resolve, _reject) => {
    setTimeout(() => resolve(filterAndMapCiies(query)), 600)
  })

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
    options: {
      altInput: true,
      altFormat: "M j, Y",
      dateFormat: "Y-m-d",
      minDate: "today",
      wrap: true,
    },
  },
  checkOut: {
    type: "date",
    focusOnNext: "guests",
    options: {
      minDateFrom: "checkIn",
      altInput: true,
      altFormat: "M j, Y",
      dateFormat: "Y-m-d",
      wrap: true,
    },
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
    alert(`⚡️ Booked! ${JSON.stringify(form.state)}`)
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
          inputProps={{ placeholder: "Where are you going?" }}
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
          form={form}
          menuContainer={MenuContainer}
          optionComponent={OptionComponent}
          controlComponent={ControlComponent}
          controlProps={{ placeholder: "Add guests" }}
          name={"guests"}
        />
      </InputContainer>
      <InputContainer>
        <MainButton onClick={onBookButtonClick}>
          <FaSearch className="w-3 h-3 text-white" />
          <ButtonText>{"Search"}</ButtonText>
        </MainButton>
      </InputContainer>
    </Container>
  )
}
