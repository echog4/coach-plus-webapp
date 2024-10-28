// const getExerciseSummary = (exercise) => {
//   const { name, sets, reps, weight, unit } = exercise;
//   return `${name} - ${sets}x${reps} ${weight}${unit}`;
// };

import { format, formatDistanceToNow, parse } from "date-fns";
import { getTPURLId } from "./bas64";

export const renderGCalDescription = ({ name, overview }, email, id) =>
  `<p><strong>${name}</strong></p><p>${overview}</p>
<a href="${window.location.origin}/tp/${getTPURLId(
    email,
    id
  )}">View training plan</a>
`;

export const getTimeZone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone;

export const getDistanceText = (date) => {
  const the_date = parse(date, "yyyy-MM-dd", new Date());
  return formatDistanceToNow(the_date, { addSuffix: true });
};

export const getSQLDate = (date) => format(date, "yyyy-MM-dd");
