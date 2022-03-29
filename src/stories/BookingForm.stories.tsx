import { ComponentStory, ComponentMeta } from "@storybook/react"
import "./styles/custom.css"
import "./styles/tailwind.css"
import "flatpickr/dist/themes/material_green.css"
import { BookingForm } from "./BookingForm"

export default {
  title: "Example/BookingForm",
  component: BookingForm,
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof BookingForm>

const Template: ComponentStory<typeof BookingForm> = () => (
  <div style={{ height: "2000px" }}>
    <div className="relative w-full h-96">
      <img
        src="https://source.unsplash.com/78A265wPiO4/1920x1080"
        className="object-cover w-full h-full"
      />
      <div className="absolute bottom-0 left-0 right-0 h-full opacity-50 bg-gradient-to-l from-transparent to-black"></div>
    </div>
    <div className="absolute w-full text-center top-32">
      <h1 className="text-3xl font-bold tracking-widest text-white uppercase font-title">
        {"Book your trip"}
      </h1>
      <h3 className="mt-2 text-xl text-white">
        {"🌳 Choose your destination 🌳"}
      </h3>
    </div>
    <div className="absolute top-0 left-0 right-0 z-10 mx-8 mt-64">
      <BookingForm />
    </div>
  </div>
)

export const Basic = Template.bind({})
Basic.args = {
  label: "BookingForm",
}
