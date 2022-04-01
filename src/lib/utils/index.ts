export * from "./format-locale-google"

export const mergeRefs = (...refs) => {
  return (node) => {
    for (const ref of refs) {
      ref.current = node
    }
  }
}
