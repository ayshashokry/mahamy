import { handleError, handleResponse } from "./apiCommonUtils";
import { baseUrl } from "./baseUrl";

const statusBaseUrl = baseUrl + "/status/";

export async function getStatuses() {
  const request = new Request(statusBaseUrl, {
    headers: {
      authorization: `bearer ${localStorage.userToken}`,
    },
  });
  return await fetch(request).then(handleResponse).catch(handleError);
}
