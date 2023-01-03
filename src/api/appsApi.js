import { handleError, handleResponse } from "./apiCommonUtils";
import { baseUrl } from "./baseUrl";

const appsBaseUrl = baseUrl + "/allApplications/";

export async function getAppsList(token) {
  const request = new Request(appsBaseUrl, {
    headers: {
      authorization: `bearer ${token || localStorage.userToken}`,
    },
  });
  return await fetch(request).then(handleResponse).catch(handleError);
}
