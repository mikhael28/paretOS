/**
 *
 * @param startDate date to start from
 * @returns date in the format of "startMonth/startDate - endMonth/endDate"
 * @example getDateRange("2020-01-01") returns "01/21 - 01/26"
 */
const getDateRange = (startDate: Date) => {
  const beginMonth = startDate.getMonth();
  const beginDate = startDate.getDate();
  const end = new Date(startDate);
  end.setDate(end.getDate() + 5);
  const endMonth = end.getMonth();
  const endDate = end.getDate();

  return `${beginMonth + 1}/${beginDate + 1} - ${endMonth + 1}/${endDate + 1}`;
};

export default getDateRange;
