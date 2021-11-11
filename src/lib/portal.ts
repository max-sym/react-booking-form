import { useState, useEffect } from "react"
import ReactDOM from "react-dom"

export const Portal = ({ id, children }) => {
  const [portal, setPortal] = useState()

  useEffect(() => {
    const existingPortal = document.getElementById(id)
    if (existingPortal) {
      //@ts-ignore
      setPortal(existingPortal)
      return
    }

    const portalContainer = document.createElement("div")
    portalContainer.id = id
    const createdPortal = document.body.appendChild(portalContainer)
    //@ts-ignore
    setPortal(createdPortal)
  }, [])

  if (!portal) return null

  return ReactDOM.createPortal(children, portal)
}
