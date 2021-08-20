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
  <Selector {...args} />
)

export const Basic = Template.bind({})
Basic.args = {
  label: "Selector",
}
