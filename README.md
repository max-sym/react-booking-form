![GitHub last commit](https://img.shields.io/github/last-commit/MaxChu23/react-booking-form)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-booking-form)
![npm bundle size](https://img.shields.io/bundlephobia/min/react-booking-form)
![GitHub](https://img.shields.io/github/license/MaxChu23/react-booking-form)

# React Booking Form 🔥

Customizable light library for creating booking forms such as on hotel, restaurant, transport services websites with location, calendar, and guest fields + much more.

![Imgur](https://i.imgur.com/JsZdqht.gif)

## Live example
- [CodeSandbox playground](https://codesandbox.io/s/react-booking-form-example-9z489)
- [Storybook example](https://611f9e606d0396003a654e41-zxstavlflj.chromatic.com/?path=/story/example-bookingform--basic)

## Features included
✅ Style agnostic: style your components however you want and just give them callbacks and data from the library\
✅ Debounced location search\
✅ Focus on the next form fields after selections easily\
✅ Date calendar also allows choosing time!\
✅ Make a datetime field not allow to select date prior to another's datetime field value (e.g., so users can't specify check-in date before the check-out date) \
✅ No dependencies except a very light (and amazing) datetime library [flatpickr](https://github.com/flatpickr/flatpickr)\
✅ Guest count selection by person group\
✅ Allows human readable datetime format (configuration option provided by [flatpickr](https://github.com/flatpickr/flatpickr))\
✅ Flexible form schema

### Notes
- The library styling is very flexible, however the calendar component styling requires including a theme css file from [flatpickr](https://github.com/flatpickr/flatpickr). We made it so you can fully control it by including it yourself or creating your own theme without any dependency on the `react-booking-form`;

## Installation
npm:

`npm i react-booking-form` 

yarn:

`yarn add react-booking-form`

## Usage

To quickly catch up go to the CodeSandbox playground first.\
Then read the example below + configuration docs. Good luck 🚀

<details>

<summary>TypeScript + TailwindCSS example</summary>

Import core library components:
```js
import {
  DateInput,
  FormSchema,
  GuestsSelect,
  LocationSelect,
  useReactBookingForm,
  BookingForm as BookingFormType,
} from "react-booking-form"

// This is needed for calendar styling. Read more on flatpickr website
import "flatpickr/dist/themes/material_green.css"
```

Prepare some helper functions and city data for the location selector:

```js
// cities is an array of strings such as ["New York", "Alabama", ...]
import { cities } from "./dummy-data/cities"

// This is mocking a call to API that would return location search results
// whenever user types into the location input field.
const searchPlace = async (query) =>
  new Promise((resolve, _reject) => {
    setTimeout(() => resolve(filterAndMapCiies(query)), 600)
  })

// This is what might happen on the backend in real-life application: it would search for the city and return the results in correct format `{value: string, label: string}`.
const filterAndMapCiies = (query) =>
  cities
    .filter((city) => city.toLowerCase().includes(query.toLowerCase()))
    .map((city) => ({ value: city.toLowerCase(), label: city }))

// This is intended to be loaded into the location input field by default
const defaultLocationOptions = [
  { value: "new-york", label: "New York" },
  { value: "barcelona", label: "Barcelona" },
  { value: "los-angeles", label: "Los Angeles" },
]
```

Define your form schema:

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

Create your booking form JSX. The form would include some of the components that we imported
previously from  the `react-booking-form` and your own components. Here's the form JSX and below
are the components used (styled by TailwindCSS + twin.macro, but you can use anything for that).

```jsx
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
        <MainButton>
          <FaSearch/>
          <ButtonText>{"Search"}</ButtonText>
        </MainButton>
      </InputContainer>
    </Container>
  )
}
```

Now style your custom components:

```jsx
import tw from "twin.macro"
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaSearch,
  FaSpinner,
  FaPlus,
  FaMinus,
  FaUser,
} from "react-icons/fa"

// Form main container that wraps everything.
const Container = tw.div`rounded-full bg-white p-6 shadow-xl flex justify-between flex-col md:flex-row md:space-x-2 md:space-y-0 space-y-2`
// Styled input component for location and datetime picker main input fields.
const InputCore = tw.input`appearance-none border rounded-full w-full outline-none transition pl-4 pr-6 group-hover:border-green-500 focus:border-green-500 cursor-pointer`
// The same as `InputCore`, but as a div. This is for guest selector.
const ControlCore = tw.div`appearance-none border rounded-full w-full outline-none transition pl-4 pr-6 group-hover:border-green-500 focus:border-green-500 cursor-pointer flex items-center`
// Styled Placeholder for guests selector
const Placeholder = tw.div`text-gray-400 select-none`
// Container for the form items that wraps every field of the form
const InputContainer = tw.div`relative w-full md:w-1/3 border-l-0 flex flex-col justify-center items-center md:border-l pl-2 first:border-l-0`
// Label for the fields
const Label = tw.div`text-sm w-full font-bold mb-1 text-gray-500`
// Icon to display inside of the input fields
const IconContainer = tw.a`absolute top-0 right-0 bottom-0 h-full flex items-center pr-2 cursor-pointer text-gray-500`

// Search button
const MainButton = tw.button`appearance-none mt-5 border-0 w-full h-10 rounded-full flex justify-center items-center bg-green-500 text-white font-bold px-3`
const ButtonText = tw.div`ml-2`

// Container for location selector menu that pops up
const MenuContainer = styled.div<any>(({ isOpen }) => [
  tw`w-64 max-h-[240px] border z-10 mt-12 transform transition ease-in-out bg-white rounded-3xl overflow-y-auto overflow-x-hidden`,
  isOpen ? tw`opacity-100` : tw`opacity-0 -translate-y-4 pointer-events-none`,
])

// Styled options for the location selector menu and guest selector menu. They differ a bit, that's why there's 2 of them.
const OptionBase = tw.div`transition ease-in-out relative py-2 px-4`
const OptionContainer = tw(OptionBase)`hover:bg-green-100 cursor-pointer`

// That will be shown as a date selector input on the form
const DatePickerInput = ({ placeholder }) => (
  <div className="relative flex group h-10 w-full">
    <InputCore type="input" data-input placeholder={placeholder} />
    <IconContainer title="toggle" data-toggle>
      <FaCalendarAlt className="w-4 h-4" />
    </IconContainer>
  </div>
)

// This will be shown as a main input in the location selector
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

// This is the same as the `InputComponent` for location selector, but has slightly different properties.
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
    <div className="relative flex group h-10 w-full">
      <ControlCore
        className="outline-none focus:outline-none"
        ref={form.refs[name]}
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

// The "+"/"-" button to select guests.
const GuestButton = tw.button`appearance-none rounded-full p-2 flex items-center justify-center h-full overflow-hidden border border-gray-500 text-gray-500 hover:text-white hover:bg-green-500 hover:border-transparent transition ease-in-out disabled:opacity-50`

// Guest option. How to arrange it is completely up to you.
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
    <OptionBase className="flex justify-between items-center">
      <div>
        <p className="font-title font-bold text-sm text-gray-700">
          {option.label}
        </p>
        <p className="text-gray-500 text-sm">{option.description}</p>
      </div>
      <div className="flex justify-center items-center gap-x-2">
        <GuestButton
          onClick={onPlusClick}
          disabled={option.value >= (option.max || 100)}
        >
          <FaPlus className="w-3 h-3" />
        </GuestButton>
        <p className="font-title font-bold text-sm text-gray-700">
          {option.value}
        </p>
        <GuestButton onClick={onMinusClick} disabled={option.value === 0}>
          <FaMinus className="w-3 h-3" />
        </GuestButton>
      </div>
    </OptionBase>
  )
}

// Finally, the date picker that should accept the inputComponent as a "launcher" for the calendar menu. Read more about it on `flickr` website.
const DatePicker = (props) => (
  <DateInput className="w-full" inputComponent={DatePickerInput} {...props} />
)
```

</details>
  
<details>
  <summary>Configuration</summary>

## Basic

This is an example of schema:

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

And later the form can be passed down to the form as:

```jsx
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
        <MainButton>
          <FaSearch className="text-white w-3 h-3" />
          <ButtonText>{"Search"}</ButtonText>
        </MainButton>
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
}
```

## Form state object

```ts
export type FormState = {
  [key: string]: {
    type: FieldType
    value: FieldValue
    /**
     * Used for menus in location and guest selector.
     */
    isOpen?: boolean
    /**
     * Used to know total number of guests in guest selector.
     */
    totalCount?: number
  }
}
```

The form state object can be used to extract relevant data from the form when submitting the form.\
For example:

```jsx

export const BookingForm = () => {
  const form = useReactBookingForm({ formSchema })

  const onSubmit = () => {
    submitToAPI(form.state)
  }

  return (
    <Container>
      {/*... Here are your form input fields nicely styled ...*/}
      <SubmitButton onClick={onSubmit}>{"Search"}</SubmitButton>
    </Container>
  )
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
- Run `tw:dev` (to construct TailwindCSS CSS file)
- Run `yarn storybook`
- Develop 🚀

Whenever finished, create a PR on a separate branch for review.

## License
MIT

## Support
- [Buy me a cup of coffee](https://www.paypal.com/donate?hosted_button_id=HBNP4H89M4FTC)

