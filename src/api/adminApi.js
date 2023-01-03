import { handleError, handleResponse } from "./apiCommonUtils";
import { baseUrl } from "./baseUrl";

const adminBaseUrl = baseUrl + "/admin/";
// const token = localStorage.getItem("userToken");
export async function canUserObtainManagerStuff(token) {
  const request = new Request(adminBaseUrl + "check-admin-manager", {
    headers: {
      authorization: `bearer ${token || localStorage.userToken}`,
    },
  });
  return await fetch(request).then(handleResponse).catch(handleError);
}
