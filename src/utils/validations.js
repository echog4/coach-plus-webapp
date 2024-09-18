export const trimAndValidatePhone = (phone) => {
  const trimmedPhone = phone.replace(/\s+/g, "");
  if (!/^[\d\s]+$/.test(phone)) {
    return false;
  }
  return trimmedPhone;
};
