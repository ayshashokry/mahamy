import { handleError, handleResponse } from "./apiCommonUtils";
import { baseUrl } from "./baseUrl";
import momentHijri from "moment-hijri";

const tasksBaseUrl = baseUrl + "/tasks/";

export function getTasks() {
  const request = new Request(`${tasksBaseUrl}?isManaged=false`, {
    headers: {
      authorization: `bearer ${localStorage.userToken}`,
    },
  });
  return fetchRequest(request);
}

export function getTeamsTasks() {
  const request = new Request(`${tasksBaseUrl}?isManaged=true`, {
    headers: {
      authorization: `bearer ${localStorage.userToken}`,
    },
  });
  return fetchRequest(request);
}

export function getArchivedTasks(pageNumber, pageLimit, searchQueries) {
  const {
    nameLike,
    fromArchivingDate,
    toArchivingDate,
    categoryId,
    priorityId,
  } = searchQueries;
  let requestUrl = `${tasksBaseUrl}?isArchived=true&_sort=archivingDate&_order=desc`;
  if (pageNumber) requestUrl += `&pageNumber=${pageNumber}`;
  if (pageLimit) requestUrl += `&pageLimit=${pageLimit}`;
  if (nameLike) requestUrl += `&taskName=${nameLike}&name_like=${nameLike}`;
  if (fromArchivingDate)
    requestUrl += `&archivingDate_gte=${fromArchivingDate}&finishedOn_gte=${fromArchivingDate}`;
  if (toArchivingDate)
    requestUrl += `&archivingDate_lte=${toArchivingDate}&finishedOn_lte=${toArchivingDate}`;
  if (categoryId) requestUrl += `&categoryId=${categoryId}`;
  if (priorityId) requestUrl += `&priorityId=${priorityId}`;

  const request = new Request(requestUrl, {
    headers: {
      authorization: `bearer ${localStorage.userToken}`,
    },
  });

  return fetchRequest(request);
}

export function getSingleTask(taskId) {
  const request = new Request(tasksBaseUrl + taskId, {
    headers: {
      authorization: `bearer ${localStorage.userToken}`,
    },
  });
  return fetchRequest(request);
}

export function getCategoryTasks(categoryId) {
  const request = new Request(tasksBaseUrl + "category/" + categoryId, {
    headers: {
      authorization: `bearer ${localStorage.userToken}`,
    },
  });
  return fetchRequest(request);
}

export function getTaskComments(taskId) {
  const request = new Request(tasksBaseUrl + taskId + "/comments", {
    headers: {
      authorization: `bearer ${localStorage.userToken}`,
    },
  });
  return fetchRequest(request);
}

export function getTaskCommentsStats(taskId) {
  const request = new Request(tasksBaseUrl + taskId + "/comments-stats", {
    headers: {
      authorization: `bearer ${localStorage.userToken}`,
    },
  });
  return fetchRequest(request);
}

export function deleteTaskComment(taskId, commentId) {
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

export function saveTaskComment(taskId, comment) {
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

export function saveTask(task) {
  const request = new Request(tasksBaseUrl + (task.id || ""), {
    method: task.id ? "PUT" : "POST",
    headers: {
      "content-type": "application/json",
      authorization: `bearer ${localStorage.userToken}`,
    },
    body: JSON.stringify(task),
  });
  return fetchRequest(request);
}

export function deleteTask(taskId) {
  const request = new Request(tasksBaseUrl + taskId, {
    method: "DELETE",
    headers: {
      authorization: `bearer ${localStorage.userToken}`,
    },
  });
  return fetchRequest(request);
}

export function archiveTask(taskId) {
  return updateTaskArchivingStatus(true, taskId);
}

export function dearchiveTask(taskId) {
  return updateTaskArchivingStatus(false, taskId);
}

function updateTaskArchivingStatus(archive, taskId) {
  if (archive === undefined || archive === null) return;
  const request = new Request(
    tasksBaseUrl + taskId + `?op=${archive ? "archive" : "dearchive"}`,
    {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${localStorage.userToken}`,
      },
      body: JSON.stringify({ isArchived: archive }),
    }
  );
  return fetchRequest(request);
}

export function startTask(taskId) {
  const request = new Request(tasksBaseUrl + taskId + "?op=start", {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      authorization: `bearer ${localStorage.userToken}`,
    },
    body: JSON.stringify({
      status: 2,
      startedOn: new Date(),
    }),
  });
  return fetchRequest(request);
}
export function reStartTask(taskId) {
  const request = new Request(tasksBaseUrl + taskId + "?op=restart", {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      authorization: `bearer ${localStorage.userToken}`,
    },
    body: JSON.stringify({
      status: 1,
      startedOn: new Date(),
    }),
  });
  return fetchRequest(request);
}
export function finishTask(taskId) {
  const request = new Request(tasksBaseUrl + taskId + "?op=finish", {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      authorization: `bearer ${localStorage.userToken}`,
    },
    body: JSON.stringify({
      status: 3,
      finishedOn: momentHijri(new Date()).format("iDD/iMM/iYYYY"),
    }),
  });
  return fetchRequest(request);
}

export function pinUnpinTask(taskId, pinTask) {
  if (pinTask !== true && pinTask !== false)
    throw new Error("pinTask should be boolen");

  const request = new Request(
    tasksBaseUrl + taskId + `?op=${pinTask ? "bookmark" : "unbookmark"}`,
    {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${localStorage.userToken}`,
      },
      body: JSON.stringify({
        isPinned: pinTask,
      }),
    }
  );
  return fetchRequest(request);
}

export function getTaskRegularEmployees(taskId, reassignedOnly = false) {
  const request = new Request(
    `${tasksBaseUrl}${taskId}/employees?isReassigned=${reassignedOnly}`,
    {
      headers: {
        authorization: `bearer ${localStorage.userToken}`,
      },
    }
  );
  return fetchRequest(request);
}

export function reassignTaskByQA(taskId, employeesIds) {
  const request = new Request(
    tasksBaseUrl + taskId + "/reassign-employees-by-qa",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${localStorage.userToken}`,
      },
      body: JSON.stringify(employeesIds),
    }
  );

  return fetchRequest(request);
}

async function fetchRequest(request) {
  return await fetch(request).then(handleResponse).catch(handleError);
}
