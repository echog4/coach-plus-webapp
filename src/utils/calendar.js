// const getExerciseSummary = (exercise) => {
//   const { name, sets, reps, weight, unit } = exercise;
//   return `${name} - ${sets}x${reps} ${weight}${unit}`;
// };
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
