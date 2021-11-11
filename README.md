# React Booking Form 🔥

Flexible React library for creating booking forms such as on hotel, restaurant, transport and such websites with location search, calendar inputs, guest fields and much more.

## Preview

![Imgur](https://i.imgur.com/JsZdqht.gif)

## Example
- [Chromatic storybook example](https://www.chromatic.com/component?appId=611f9e606d0396003a654e41&name=Example%2FSelector&buildNumber=1)
- [CodeSandbox playground](https://codesandbox.io/s/optimistic-currying-9z489)

## Features
✅ Style agnostic: style your components however you want and just give them callbacks from the library for logic 💫\
✅ Debounced location search\
✅ Easily focus on the next elements after selections\
✅ No dependencies except a very light (and amazing) calendar library [flatpickr](https://github.com/flatpickr/flatpickr)\
✅ Flexible form schema\
✅ Guest count selection by person group\

### Notes
- The library styling is very flexible, however the calendar component styling requires including a theme css file from [flatpickr](https://github.com/flatpickr/flatpickr). We made it so you can fully control it by including it yourself or creating your own theme without any dependency on the `react-booking-form`;

## Installation
npm:

`npm i react-booking-form` 

yarn:

`yarn add react-booking-form`

## Usage

Here's an example using [TailwindCSS](https://github.com/tailwindlabs/tailwindcss) styling library:

```jsx

import {
  convertFormToURLParams,
  DateInput,
  GuestsSelect,
  LocationSelect,
  useReactBookingForm
} from "react-booking-form"
import "flatpickr/dist/themes/material_green.css"
import { FaMapMarkerAlt } from "react-icons/fa"
import { IoCalendarClear } from "react-icons/io5"
import { HiOutlineSearch } from "react-icons/hi"

const cities = ["New York", "Los Angeles", "Barcelona", "Madrid"]

const dataProvider = {
  searchPlace: async (queryString) => {
    return new Promise((resolve, _reject) => {
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
  }
}

const defaultLocationOptions = [
  { value: "barcelona", label: "Barcelona" },
  { value: "new-york", label: "New York" },
  { value: "los-angeles", label: "Los Angeles" },
  { value: "san-francisco", label: "San Francisco" }
]

const defaultForm = {
  location: null,
  dateFrom: undefined,
  dateTo: undefined,
  guests: null
}

const InputContainer = ({ children }) => (
  <div className="relative w-full md:w-1/3 border-l-0 md:border-l pl-2 first:border-l-0">
    {children}
  </div>
)

const DatePicker = ({ ...props }) => (
  <DateInput
    className="relative flex h-full"
    iconComponent={
      <a className="absolute top-0 right-0 bottom-0 h-full flex items-center pr-2 cursor-pointer">
        <IoCalendarClear />
      </a>
    }
    inputComponent={
      <input className="border rounded-full w-full hover:text-blue-500 outline-none focus:border-blue-500 pl-4 pr-6" />
    }
    {...props}
  />
)

/**
 * Primary UI component for user interaction
 */
export const Selector = () => {
  const onSelectionComplete = () => {
    const results = convertFormToURLParams({ form })
    alert(`Redirect to search page: ${results}`)
  }

  const {
    form,
    setFormFields,
    checkInOptions,
    checkOutOptions,
    focusOn,
    refs
  } = useReactBookingForm({
    defaultForm,
    onSelectionComplete
  })

  const onLocationChange = ({ value }) => {
    setFormFields({ location: value })
    focusOn("checkIn")
  }

  const onCheckInChange = (value) => {
    setFormFields({ dateFrom: value })
    focusOn("checkOut")
  }

  const onCheckOutChange = (value) => {
    setFormFields({ dateTo: value })
    focusOn("guests")
  }

  const onGuestsSelectChange = (event) => {
    setFormFields({ guests: event.target.value })
  }

  const searchPlace = async (queryString) => {
    const result = await dataProvider.searchPlace(queryString)
    return result
  }

  return (
    <div className="rounded-full bg-white p-6 shadow-xl flex justify-between flex-col md:flex-row md:space-x-2 md:space-y-0 space-y-2">
      <InputContainer>
        <LocationSelect
          className="w-full"
          defaultOptions={defaultLocationOptions}
          dropdownComponent={FaMapMarkerAlt}
          name="location"
          onLocationChange={onLocationChange}
          placeholder="Location"
          searchPlace={searchPlace}
        />
      </InputContainer>
      <InputContainer>
        <DatePicker
          containerRef={refs.checkIn}
          onChange={onCheckInChange}
          options={checkInOptions}
          placeholder="Check in"
        />
      </InputContainer>
      <InputContainer>
        <DatePicker
          containerRef={refs.checkOut}
          onChange={onCheckOutChange}
          options={checkOutOptions}
          placeholder="Check out"
        />
      </InputContainer>
      <InputContainer>
        <GuestsSelect
          containerRef={refs.guests}
          className="border rounded-full w-full h-full pl-4 hover:text-blue outline-none focus:border-blue-500"
          onChange={onGuestsSelectChange}
        />
      </InputContainer>
      <InputContainer style={{ flexBasis: "38px", flexShrink: 0, flexGrow: 1 }}>
        <button className="appearance-none border-0 w-full h-full rounded-full flex justify-center items-center bg-green-500 text-white font-bold px-3">
          <HiOutlineSearch className="text-white w-5 h-5" />
          <div className="ml-2">Search</div>
        </button>
      </InputContainer>
    </div>
  )
}
```

## Contribution guide
- Clone the repository to your local machine;
- Run `yarn` in the root
- Run `tw:dev` (to construct TailwindCSS CSS file)
- Run `yarn storybook`
- Develop 🚀

Whenever finished, create a PR on a separate branch for review.

## Licence
MIT

## Support
- Buy me a cup of coffee https://www.paypal.com/donate?hosted_button_id=HBNP4H89M4FTC

