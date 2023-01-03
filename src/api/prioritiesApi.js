import { handleError, handleResponse } from "./apiCommonUtils";
import {  baseUrl } from "./baseUrl";

const groupsBaseUrl = baseUrl + "/priorities/";

export async function getPriorities() {
  const request = new Request(groupsBaseUrl, {
    headers: {
      authorization: `bearer ${localStorage.userToken}`,
    },
  });
  return await fetch(request).then(handleResponse).catch(handleError);
}
