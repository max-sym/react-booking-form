import moment from "moment"

export const convertFormToURLParams = ({ form }) => {
  const parsedForm = {
    location: form.location.value,
    dateTo: moment(form.dateTo[0]).format("yyyy-MM-DD"),
    dateFrom: moment(form.dateFrom[0]).format("yyyy-MM-DD"),
    guests: form.guests,
  }
  return new URLSearchParams(parsedForm).toString()
}
