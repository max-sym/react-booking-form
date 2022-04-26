![npm](https://img.shields.io/npm/dm/react-booking-form?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/MaxChu23/react-booking-form?style=flat-square)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-booking-form@2.0.0-alpha.1?style=flat-square)
![npm bundle size](https://img.shields.io/bundlephobia/min/react-booking-form@2.0.0-alpha.1?style=flat-square)
![GitHub](https://img.shields.io/github/license/MaxChu23/react-booking-form?style=flat-square)

# React Booking Form 🔥

Lightweight, flexible library for quickly creating booking forms for websites with purposes such as hotel, restaurant, transport services booking and similar.\
Includes location, calendar, and guest selectors logic (style agnostic) and much more.

<img src="https://i.imgur.com/9JBUX53.gif" width="100%" />

## Live examples
- [CodeSandbox](https://codesandbox.io/s/react-booking-form-example-9z489)
- [Storybook](https://611f9e606d0396003a654e41-sfznirawpt.chromatic.com/?path=/story/booking-form--basic)


## Installation
npm: `npm i react-booking-form`\
yarn: `yarn add react-booking-form`

## Features included
### Main:

✅ Style agnostic: style your components however you want. Logic is taken care of by the library\
✅ Debounced location search\
✅ Swap locations\
✅ Focus on the next form fields right after selections\
✅ Date calendar with time selector [flatpickr](https://github.com/flatpickr/flatpickr)\
✅ Ability to set check-out minimum date depending on the selected check-in date value.\
✅ Allows human readable datetime format + localization (configuration options provided by [flatpickr](https://github.com/flatpickr/flatpickr))\
✅ Little size\
✅ Guest count selection by person group

### Layout & DOM:

✅ Popups' position is relative to the browser window's position and size (i.e., it would try to make the popups visible even if not enough height)\
✅ Uses [React Portal](https://reactjs.org/docs/portals.html) under the hood 🎩\
✅ Accessible\
✅ Responsive


### Notes
- The library styling is very flexible, however the calendar component styling requires including a theme css file from [flatpickr](https://github.com/flatpickr/flatpickr). We made it so you can fully control it by including it yourself or creating your own theme;

## Usage

To quickly catch up go to the CodeSandbox Playground first.\
Then read the example below + configuration docs.

<details>
<summary> 👉 TypeScript + TailwindCSS example (with <a href="https://github.com/MathiasGilson/Tailwind-Styled-Component">tailwind-styled-components</a>)</summary>
	
### Install

```bash
yarn add react-booking-form moment @react-icons/all-files tailwind-styled-components
```

### Import the libraries:

```js
import React from "react"
import {
  DateInput,
  FormSchema,
  GuestSelect,
  GuestOption,
  LocationSelect,
  useReactBookingForm,
  BookingForm as BookingFormType,
  LocationOption,
} from "react-booking-form"
import tw from "tailwind-styled-components"
import moment from "moment"
```

### Prepare some helper functions:

Here's some helpers that represent something similar to how we would fetch the city data in a real-world application for the location selector:

Create a file called `cities.ts`:

```js
export const cities = [
	"New York",
	"Alabama",
	"Los Angeles",
	// ... Add more cities if you want 
]
```

Then import `cities` and add some helper functions:	

```js
import { cities } from "./cities"

// This is mocking a call to API that would return location search results
// whenever user types into the location input field.
const searchPlace = async (query: string) =>
  new Promise((resolve, _reject) => {
    setTimeout(() => resolve(filterAndMapCiies(query)), 600)
  })

const formattedCities = cities.map((city) => ({
  value: city.toLowerCase(),
  label: city,
}))
	
// This is what might happen on the backend in real-life application: it would search for the city.
const filterAndMapCiies = (query: string) =>
  formattedCities.filter((city) => city.value.includes(query.toLowerCase()))

// This is the list of cities to be shown initially when user didn't start the search of location yet.
const defaultLocationOptions: LocationOption[] = formattedCities.slice(0, 5)

```

### Define your form schema:

```js
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
```

### Create your booking form JSX

The form would include some of the components that we imported previously from the `react-booking-form` and your own components:

```jsx
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
```

### Styling Components
	
Below are our own custom components (styled by tailwind-styled-components, but you can use anything for styling).

Import the icons right away:

```jsx
import { FaMapMarkerAlt } from "@react-icons/all-files/fa/FaMapMarkerAlt"
import { FaCalendarAlt } from "@react-icons/all-files/fa/FaCalendarAlt"
import { FaSpinner } from "@react-icons/all-files/fa/FaSpinner"
import { FaPlus } from "@react-icons/all-files/fa/FaPlus"
import { FaMinus } from "@react-icons/all-files/fa/FaMinus"
import { FaUser } from "@react-icons/all-files/fa/FaUser"
import { IoMdSwap } from "@react-icons/all-files/io/IoMdSwap"
```
	
Now start styling with `tw` from `tailwind-styled-components` package.

```jsx
const Container = tw.div`md:rounded-full rounded-xl bg-white p-6 shadow-xl flex justify-between flex-col md:flex-row md:space-x-2 md:space-y-0 space-y-2 border border-gray-300`
const InputContainer = tw.div`relative w-full md:w-1/3 flex flex-col justify-center items-center pl-2`
const InputCore = tw.input`relative w-full peer flex h-10 focus:outline-none appearance-none border border-gray-300 rounded-full outline-none transition pl-4 pr-6 group-hover:border-green-500 focus:border-green-500 cursor-pointer`
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
```

And finally add 2 more components.

The first one would be `InputComponent` used as an `input` in the main form:
```jsx
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
```

And `GuestOptionComponent` to be used in our guest selector menu:

```jsx
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
```	
</details>
  
<details>

<summary> 👉 Documentation</summary>

## Basic

Here's the form schema object. This is the main library configuration:

```js
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
	// These are entirely flatpickr options
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
	// These are entirely flatpickr options
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
```

It should be used by `useReactBookingForm` as:

```js
const form = useReactBookingForm({ formSchema })
```

And later the `form` can be passed down to the `BookingForm` as:

```jsx
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
```

## Form object
	
The `form` that's returned in the example above is an object that can be used to read current form state
	as well as call different callbacks on form input fields and much more.

This is the `form` type:

```ts
export type BookingForm = {
  /**
   * Form schema provided by the user.
   */
  formSchema: FormSchema
  /**
   * Current form state.
   */
  state: FormState
  setState: (state: FormState) => void
  /**
   * Helper that sets the particular field value in the form.
   */
  setFieldValue: (key: string, value: any) => void
  /**
   * Helper that sets the particular field state in the form.
   */
  setFieldState: (key: string, state: any) => void
  /**
   * An array of references to the form fields.
   * This can be used to focus on a particular field and do other relevant actions.
   */
  refs: RefsType
  /**
   * Helper that allows to focus on a particular field just by passing field key to it.
   */
  focusOn: (key?: string) => void
  /**
   * This is a helper that allows to change a particular option item state.
   * For example, if you want to increment the number of "adults", you can use this helper as:
   * ```
   * form.setGuestOptionValue(name, option, option.value + 1)
   * ```
   */
  setGuestOptionValue: (key: string, option: any, value: any) => void
  /**
   * A callback to pass to the guest minus button click event.
   */
  onMinusClick: (option: GuestOption, name: string) => () => void
  /**
   * A callback to pass to the guest plus button click event.
   */
  onPlusClick: (option: GuestOption, name: string) => () => void
  /**
   * A callback to pass to the guest buttons to determine if the buttons are disabled.
   */
  getIsOptionDisabled: (
    option: GuestOption,
    optionType: "plus" | "minus"
  ) => boolean
  /**
   * This can be used to swap the location fields.
   */
  swapLocations: (fieldKeys?: [string, string] | undefined) => void
  /**
   * Converts the form state to url query string.
   * Use convertDate to convert dates to the desired format.
   */
  serializeToURLParams: ({
    convertDate,
  }: {
    convertDate?: (dateValue: Date) => any
  }) => string
}
```

## Form state object

```ts
export type FormState = {
  [key: string]: {
    type: FieldType
    value: FieldValue
    /**
     * Used to know total number of guests in guest selector.
     */
    totalCount?: number
  }
}
```
	
## Schema object
		
| Name         	| Type                                        	| Required 	| Description                                                                                                                                                                                          	| Example                                                                                                                          	|
|--------------	|---------------------------------------------	|----------	|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|----------------------------------------------------------------------------------------------------------------------------------	|
| type         	| `"location" \| "date" \| "peopleCount"`     	| ✅         | The type of the field                                                                                                                                                                                	| "location"                                                                                                                       	|
| focusOnNext  	| `string`                                    	|          	| The key of some form schema object item to focus upon after selecting this field                                                                                                                     	| "checkIn" (if checkIn key exists in the `formSchema` object)                                                                     	|
| defaultValue 	| `LocationOption \| GuestOption[] \| string` 	|          	| Default value of the field. In case of the type of the form field being "location", it should be of LocationOption type. Should be an array of `GuestOption`'s in case of "peopleCount" respectively 	| Location example: ``` {   label: "New York",   value: "new-york" } ```  Guest Example:  ``` {   value: 1,   name: "adults" } ``` 	|
| options      	| `Options`                                   	|          	| Options object. Refer to its schema (defined below)                                                                                                                                                  	|                                                                                                                                  	|		

## Options

| Name                     	| Type                                   	| Description                                                                                                                                          	|
|--------------------------	|----------------------------------------	|------------------------------------------------------------------------------------------------------------------------------------------------------	|
| `defaultLocationOptions` 	| `LocationOption[]`                     	| If the field type is "location" then it accepts these locations as default values                                                                    	|
| `searchPlace`            	| `(queryString:string) => Promise<any>` 	| A function that fetches the location data. Refer to the TypeScript example in the repo documentation.                                                	|
| `[key: string]`          	| `any`                                  	| **Parameters that will be passed down to the flatpickr React component. [Here's a list of options you can pass](https://flatpickr.js.org/options/)** 	|

</details>

## Contribution Guide
- Clone the repository to your local machine;
- Run `yarn` in the root
- Run `yarn start`
- Go to `localhost:6006` and see magic happen 🚀

Whenever finished, create a PR on a separate branch for review.

Contributions are very welcome!

## License
MIT

