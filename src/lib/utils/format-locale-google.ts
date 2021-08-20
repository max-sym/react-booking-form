export const formatLocaleGoogle = (results) => {
  return results.map((place) => ({
    value: place.place_id,
    label:
      place.structured_formatting.main_text +
      " | " +
      place.structured_formatting.secondary_text,
  }))
}
