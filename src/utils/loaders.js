import { propOr, isNil } from "ramda";

const keyValueToParamString = ({ key, value }) =>
  `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;

const queryParamsToQueryString = (params) => {
  if (!params) return "";

  return Object.keys(params)
    .reduce((result, key) => {
      const value = params[key];
      return isNil(value)
        ? result
        : result.concat(keyValueToParamString({ key, value }));
    }, [])
    .join("&");
};

const buildUrl = (url, params) => {
  const queryString = queryParamsToQueryString(params);
  return queryString.length === 0 ? url : `${url}?${queryString}`;
};

const defaultContentTypeHeaders = {
  "content-type": "application/json",
};

const getHeaders = (headers) => ({
  ...defaultContentTypeHeaders,
  ...headers,
});

const handleResponse = (res) =>
  res.ok
    ? res.json()
    : res.json().then((responseBody) =>
        Promise.reject({
          url: res.url,
          error:
            propOr(undefined, "error")(responseBody) ||
            propOr(undefined, "Message")(responseBody),
          status: res.status,
          statusText: res.statusText,
        })
      );

export const postJSON = (url, body, headers) =>
  fetch(url, {
    method: "POST",
    headers: getHeaders(headers),
    body: JSON.stringify(body),
  }).then(handleResponse);

export const putJSON = (url, body, headers) =>
  fetch(`${url}`, {
    method: "PUT",
    headers: getHeaders(headers),
    body: JSON.stringify(body),
  }).then(handleResponse);

export const getJSON = (url, queryParams, headers) => {
  const urlWithQueryParams = buildUrl(url, queryParams);
  return fetch(`${urlWithQueryParams}`, {
    method: "GET",
    headers: getHeaders(headers),
  }).then(handleResponse);
};

export const deleteJSON = (url, queryParams, headers) => {
  const urlWithQueryParams = buildUrl(url, queryParams);
  return fetch(`${urlWithQueryParams}`, {
    method: "DELETE",
    headers: getHeaders(headers),
  }).then(handleResponse);
};
