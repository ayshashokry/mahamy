import { handleError, handleResponse } from "./apiCommonUtils";
import { baseUrl } from "./baseUrl";

const workingDaysBaseUrl = baseUrl + "/next-working-day/";

export async function getNextWorkingDay(numWorkingDays) {
  const request = new Request(
    workingDaysBaseUrl + `?numWorkingDays=${numWorkingDays}`,
    {
      headers: {
        authorization: `bearer ${localStorage.userToken}`,
      },
    }
  );
  return await fetch(request).then(handleResponse).catch(handleError);
}
