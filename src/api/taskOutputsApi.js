import { handleError, handleResponse } from "./apiCommonUtils";
import { baseUrl } from "./baseUrl";

const outputsBaseUrl = baseUrl + "/outputs/";

export async function getOutputs() {
  const request = new Request(outputsBaseUrl, {
    headers: {
      authorization: `bearer ${localStorage.userToken}`,
    },
  });
  return await fetch(request).then(handleResponse).catch(handleError);
}
