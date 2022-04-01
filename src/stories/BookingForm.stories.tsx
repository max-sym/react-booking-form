import { ComponentStory, ComponentMeta } from "@storybook/react"
import "./styles/custom.css"
import "./styles/tailwind.css"
import "flatpickr/dist/themes/material_green.css"
import { BookingForm } from "./BookingForm"
import tw from "tailwind-styled-components"

export default {
  title: "Booking Form",
  component: BookingForm,
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof BookingForm>

const Overlay = tw.div`absolute bottom-0 left-0 w-2/3 h-full bg-gradient-to-l from-transparent to-black`
const Image = tw.img`object-cover w-full h-full`
const Title = tw.h1`text-5xl font-bold tracking-widest text-white font-title`
const TitleDark = tw.h2`text-4xl font-bold tracking-widest text-gray-900 font-title`
const Subtitle = tw.h3`mt-2 text-xl text-white`
const BookingFormContainer = tw.div`absolute top-16 left-0 right-0 z-10 px-8 max-w-[1280px] mx-auto`

const Background = () => (
  <div className="relative z-0 mx-auto max-w-[1280px] h-96 rounded-3xl overflow-hidden">
    <Image src="https://source.unsplash.com/PRm3qPOWU-Y/1920x1080" />
    <TitleSection />
    <Overlay />
  </div>
)

const TitleSection = () => (
  <div className="absolute z-20 w-full text-left left-16 top-24">
    <Title>{"Enjoy Your Trip"}</Title>
    <Subtitle>{"Choose your destination and enjoy that vacation!"}</Subtitle>
  </div>
)

const Template: ComponentStory<typeof BookingForm> = () => (
  <div className="h-[2000px] pt-8">
    <BookingFormContainer>
      <BookingForm />
    </BookingFormContainer>
  </div>
)

export const Basic = Template.bind({})
Basic.args = {
  label: "BookingForm",
}
