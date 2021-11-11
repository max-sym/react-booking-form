import { ComponentStory, ComponentMeta } from "@storybook/react"
import "./styles/custom.css"
import "./styles/index.css"
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
    <div className="w-full h-96 relative">
      <img
        src="https://source.unsplash.com/78A265wPiO4/1920x1080"
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-l from-transparent to-black opacity-50"></div>
    </div>
    <div className="absolute top-32 text-center w-full">
      <h1 className="uppercase font-bold text-3xl text-white tracking-widest font-title">
        {"Book your trip"}
      </h1>
      <h3 className="text-xl text-white mt-2">
        {"🌳 Choose your destination 🌳"}
      </h3>
    </div>
    <div className="absolute top-0 left-0 right-0 mt-64 mx-8 z-10">
      <BookingForm />
    </div>
  </div>
)

export const Basic = Template.bind({})
Basic.args = {
  label: "BookingForm",
}
