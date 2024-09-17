export const objectEncodeBase64 = (obj) => {
  // Convert the object to a JSON string
  const jsonString = JSON.stringify(obj);

  // Convert the JSON string to a base64 encoded string
  const base64String = btoa(jsonString);

  return base64String;
};

// Decode a base64 encoded string to an object
export const objectDecodeBase64 = (base64String) => {
  // Convert the base64 string to a JSON string
  const jsonString = atob(base64String);

  // Convert the JSON string to an object
  const obj = JSON.parse(jsonString);

  return obj;
};
