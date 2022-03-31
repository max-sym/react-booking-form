import React, { useMemo, useState } from "react"
import { usePopper } from "react-popper"
import { OffsetType } from "./guest-select"

export const useSelectPopper = ({
  offset = [0, 10],
}: {
  offset?: OffsetType
}) => {
  const [element, setElement] = useState<HTMLInputElement | null>(null)
  const [popper, setPopper] = useState<HTMLUListElement | null>(null)

  const { styles, attributes } = usePopper(element, popper, {
    placement: "bottom",
    strategy: "fixed",
    modifiers: [{ name: "offset", options: { offset } }],
  })

  return useMemo(
    () => ({
      element,
      setElement,
      popper,
      setPopper,
      styles,
      attributes,
    }),
    [element, setElement, popper, setPopper, styles, attributes]
  )
}
