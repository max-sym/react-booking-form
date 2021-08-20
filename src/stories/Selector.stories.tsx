import { ComponentStory, ComponentMeta } from "@storybook/react"
import "./styles/index.css"
import "flatpickr/dist/themes/material_green.css"
import { Selector } from "./Selector"

export default {
  title: "Example/Selector",
  component: Selector,
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof Selector>

const Template: ComponentStory<typeof Selector> = (args) => (
  <div className="">
    <div className="w-full h-96 relative">
      <img
        src="https://picsum.photos/id/1039/1200/630"
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-b from-transparent to-black"></div>
    </div>
    <div className="absolute top-32 text-center w-full">
      <h1 className="uppercase bold text-4xl text-white leading-wide">
        Book your holidays!
      </h1>
      <h3 className="text-xl text-green-400">
        Best holidays ever only on this website 🌴
      </h3>
    </div>
    <div className="absolute top-0 left-0 right-0 mt-64 mx-8 z-10">
      <Selector {...args} />
    </div>
  </div>
)

export const Basic = Template.bind({})
Basic.args = {
  label: "Selector",
}
