// const getExerciseSummary = (exercise) => {
//   const { name, sets, reps, weight, unit } = exercise;
//   return `${name} - ${sets}x${reps} ${weight}${unit}`;
// };

import { formatDistanceToNow, parse } from "date-fns";

// TODO: change base URL
export const renderGCalDescription = ({
  id,
  name,
  overview,
}) => `<p><strong>${name}</strong></p><p>${overview}</p>
<a href="https://coach-plus-ui.vercel.app/tp/${id}">View training plan</a>
`;

export const getTimeZone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone;

export const getDistanceText = (date) => {
  const the_date = parse(date, "yyyy-MM-dd", new Date());
  return formatDistanceToNow(the_date, { addSuffix: true });
};

export const getSQLDate = (date) =>
  `${date.getYear()}-${date.getMonth() + 1}-${date.getDate()}`;
