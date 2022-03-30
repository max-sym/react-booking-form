import React, { useMemo, useState } from "react"
import { usePopper } from "react-popper"
import { OffsetType } from "./location-select"

export const useSelectPopper = ({
  offset = [0, 10],
}: {
  offset?: OffsetType
}) => {
  const [button, setButton] = useState<HTMLInputElement | null>(null)
  const [popper, setPopper] = useState<HTMLUListElement | null>(null)

  const { styles, attributes } = usePopper(button, popper, {
    placement: "bottom",
    strategy: "fixed",
    modifiers: [{ name: "offset", options: { offset } }],
  })

  return useMemo(
    () => ({
      button,
      setButton,
      popper,
      setPopper,
      styles,
      attributes,
    }),
    [button, setButton, popper, setPopper, styles, attributes]
  )
}
