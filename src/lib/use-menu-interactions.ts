import { BookingForm } from "lib"
import { useMemo, useRef } from "react"

export const useMenuInteractions = ({
  form,
  name,
}: {
  form: BookingForm
  name: string
}) => {
  const menuContainerRef = useRef<HTMLDivElement>(null)

  const onFocus = () => {
    form.setFieldState(name, { isOpen: true })
  }

  const onBlur = () => {
    setTimeout(() => {
      if (menuContainerRef.current?.contains?.(document.activeElement)) {
        form.refs[name]?.current?.focus()
        return
      }

      form.setFieldState(name, { isOpen: false })
    }, 10)
  }

  return useMemo(() => ({ onFocus, onBlur, menuContainerRef }), [])
}
