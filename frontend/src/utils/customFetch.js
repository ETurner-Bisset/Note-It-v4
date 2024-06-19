const customFetch = async (
  url,
  method = 'GET',
  body = null,

  credentials = 'include'
) => {
  const response = await fetch(url, {
    method,
    body,
    headers: { 'Content-Type': 'application/json' },
    credentials,
  });

  // console.log(response);
  if (!response.ok || response.status === 204) {
    return response;
  }
  const responseData = await response.json();

  // console.log(responseData);

  return responseData;
};

export default customFetch;
