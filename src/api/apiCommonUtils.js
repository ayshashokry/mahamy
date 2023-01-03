export const handleResponse = async response => {
  if (response.ok) return response.json();
  if (response.status === 400) {
    const error = await response.text();
    throw new Error(error);
  }
  console.log(await response.text());

  throw new Error("Error occured other than 400");
};

export const handleError = error => {
  console.error("API call failed... " + error);
  throw error;
};
