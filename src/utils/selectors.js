export const getAthleteName = (athlete) => {
  return athlete.first_name
    ? `${athlete.first_name} ${athlete.last_name}`
    : athlete.full_name
    ? athlete.full_name
    : athlete.email;
};
