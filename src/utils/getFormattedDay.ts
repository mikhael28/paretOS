/**
 * This function returns the formatted day.
 * @param startDate date to be formatted
 * @param displayDay index of the day to display
 * @returns date in the format of "day, month/date"
 * @example getFormattedDay("2020-01-01") returns "Tuesday, 12/17"
 */
function getFormattedDay(startDate: Date, displayDay): string {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const month = startDate.getMonth();
  const dayOfWeek = startDate.getDay();
  const date = startDate.getDate();
  return `${days[dayOfWeek]}, ${month + 1}/${date + displayDay}`;
}

export default getFormattedDay;
