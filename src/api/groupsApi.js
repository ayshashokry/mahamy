import { handleError, handleResponse } from "./apiCommonUtils";
import { baseUrl } from "./baseUrl";

const groupsBaseUrl = baseUrl + "/groupsusermhamy/";
const managedGroupsBaseUrl = baseUrl + "/managed-groups/";

export async function getGroups() {
  const request = new Request(groupsBaseUrl, {
    headers: {
      authorization: `bearer ${localStorage.userToken}`,
    },
  });
  return await fetch(request).then(handleResponse).catch(handleError);
}

export async function getUsersInGroup(groupId) {
  const request = new Request(groupsBaseUrl + groupId + "/users/", {
    headers: {
      authorization: `bearer ${localStorage.userToken}`,
    },
  });
  return await fetch(request).then(handleResponse).catch(handleError);
}

export async function getManagedGroupsWithUsers() {
  const request = new Request(managedGroupsBaseUrl, {
    headers: {
      authorization: `bearer ${localStorage.userToken}`,
    },
  });
  return await fetch(request).then(handleResponse).catch(handleError);
}
