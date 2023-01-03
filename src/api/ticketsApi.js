import { handleError, handleResponse } from "./apiCommonUtils";
import { baseUrl } from "./baseUrl";

const tasksBaseUrl = baseUrl + "/ticket/";

export function getTicketComments(taskId) {
  const request = new Request(tasksBaseUrl + taskId + "/comments", {
    headers: {
      authorization: `bearer ${localStorage.userToken}`,
    },
  });
  return fetchRequest(request);
}

export function getTicketCommentsStats(taskId) {
  const request = new Request(tasksBaseUrl + taskId + "/comments-stats", {
    headers: {
      authorization: `bearer ${localStorage.userToken}`,
    },
  });
  return fetchRequest(request);
}

export function deleteTicketComment(taskId, commentId) {
  const request = new Request(
    tasksBaseUrl + taskId + "/comments/" + commentId,
    {
      method: "DELETE",
      headers: {
        authorization: `bearer ${localStorage.userToken}`,
      },
    }
  );
  return fetchRequest(request);
}

export function saveTicketComment(taskId, comment) {
  const request = new Request(
    tasksBaseUrl + taskId + "/comments/" + (comment.id || ""),
    {
      method: comment.id ? "PUT" : "POST",
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${localStorage.userToken}`,
      },
      body: JSON.stringify(comment),
    }
  );

  return fetchRequest(request);
}

async function fetchRequest(request) {
  return await fetch(request).then(handleResponse).catch(handleError);
}
