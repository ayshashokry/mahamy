import { handleError, handleResponse } from "./apiCommonUtils";
import { baseUrl } from "./baseUrl";
import qs from "qs";
//Categories Table
export async function getCategoriesStatistics(
  pageNumber,
  itemsPerPage,
  filterQuery
) {
  const { employeeId, from, to, categoryId } = filterQuery;
  let requestUrl = `${baseUrl}/stats/categories?itemsPerPage=${itemsPerPage}`;
  if (pageNumber) requestUrl += `&pageNumber=${pageNumber}`;
  if (employeeId) requestUrl += `&employeeId=${employeeId}`;
  if (from) requestUrl += `&from=${from}`;
  if (to) requestUrl += `&to=${to}`;

  const request = new Request(requestUrl, {
    headers: {
      authorization: `bearer ${localStorage.userToken}`,
    },
  });

  return await fetch(request).then(handleResponse).catch(handleError);
}
//Employees Table
export async function getEmployeesStatistics(
  pageNumber,
  itemsPerPage,
  filterQuery
) {
  const { from, to, categoryId, employeeId } = filterQuery;
  let requestUrl = `${baseUrl}/stats/employees?itemsPerPage=${itemsPerPage}`;
  if (pageNumber) requestUrl += `&pageNumber=${pageNumber}`;
  if (from) requestUrl += `&from=${from}`;
  if (to) requestUrl += `&to=${to}`;
  const request = new Request(requestUrl, {
    headers: {
      authorization: `bearer ${localStorage.userToken}`,
    },
  });

  return await fetch(request).then(handleResponse).catch(handleError);
}

//Tasks In Category Pie Chart
export async function getTasksInCategoryStatisticsPieChart(
  pageNumber,
  itemsPerPage,
  categoryId,
  filterQuery
) {
  const { from, to, employeeId } = filterQuery;
  let cat = qs.stringify({ categoryId: categoryId }, { indices: false });
  let requestUrl = `${baseUrl}/stats/tasks?${cat}`;
  if (from) requestUrl += `&from=${from}`;
  if (to) requestUrl += `&to=${to}`;
  const request = new Request(requestUrl, {
    headers: {
      authorization: `bearer ${localStorage.userToken}`,
    },
  });

  return await fetch(request).then(handleResponse).catch(handleError);
}

//Employee In Category Pie Chart
export async function getEmployeeStatisticsPieChart(filterQuery) {
  const { from, to, categoryId, employeeId } = filterQuery;
  let cat = qs.stringify({ categoryId: categoryId }, { indices: false });

  let requestUrl = `${baseUrl}/stats/employee/duedate?EmployeeId=${employeeId}`;
  if (from) requestUrl += `&from=${from}`;
  if (to) requestUrl += `&to=${to}`;
  if (categoryId) requestUrl += `&${cat}`;

  const request = new Request(requestUrl, {
    headers: {
      authorization: `bearer ${localStorage.userToken}`,
    },
  });

  return await fetch(request).then(handleResponse).catch(handleError);
}

export async function getEmployeeTaskCountStats(filterQuery) {
  const { from, to, categoryId, employeeId } = filterQuery;
  let cat = qs.stringify({ categoryId: categoryId }, { indices: false });

  let requestUrl = `${baseUrl}/stats/employee/tasks?EmployeeId=${employeeId}`;
  if (from) requestUrl += `&from=${from}`;
  if (to) requestUrl += `&to=${to}`;
  if (categoryId) requestUrl += `&${cat}`;

  const request = new Request(requestUrl, {
    headers: {
      authorization: `bearer ${localStorage.userToken}`,
    },
  });

  return await fetch(request).then(handleResponse).catch(handleError);
}

//Categories Pie Chart

export async function getCategoryStatisticsPieChart(
  pageNumber,
  itemsPerPage,
  filterQuery
) {
  const { from, to, employeeId, categoryId } = filterQuery;

  let requestUrl = `${baseUrl}/stats/tasks?itemsPerPage=${itemsPerPage}`;
  if (pageNumber) requestUrl += `&pageNumber=${pageNumber}`;
  if (from) requestUrl += `&from=${from}`;
  if (to) requestUrl += `&to=${to}`;
  const request = new Request(requestUrl, {
    headers: {
      authorization: `bearer ${localStorage.userToken}`,
    },
  });

  return await fetch(request).then(handleResponse).catch(handleError);
}

//Tasks In Category Table
export async function getTasksInCategoryStatisticsTable(
  pageNumber,
  itemsPerPage,
  categoryId,
  filterQuery
) {
  let cat = qs.stringify({ categoryId: categoryId }, { indices: false });
  const { from, to, employeeId } = filterQuery;
  let requestUrl = `${baseUrl}/stats/tasks/category?${cat}`;
  if (pageNumber) requestUrl += `&pageNumber=${pageNumber}`;
  if (from) requestUrl += `&from=${from}`;
  if (to) requestUrl += `&to=${to}`;

  if (itemsPerPage) requestUrl += `&itemsPerPage=${itemsPerPage}`;

  const request = new Request(requestUrl, {
    headers: {
      authorization: `bearer ${localStorage.userToken}`,
    },
  });

  return await fetch(request).then(handleResponse).catch(handleError);
}

//Outputs Chart
export async function getOutputsStatisticsCharts(filterQuery) {
  const { from, to, employeeId, categoryId } = filterQuery;
  let cat = qs.stringify({ categoryId: categoryId }, { indices: false });
  let requestUrl = `${baseUrl}/stats/outputs?`;
  if (from) requestUrl += `&from=${from}`;
  if (to) requestUrl += `&to=${to}`;
  if (employeeId) requestUrl += `&employeeId=${employeeId}`;
  if (categoryId) requestUrl += `&${cat}`;
  const request = new Request(requestUrl, {
    headers: {
      authorization: `bearer ${localStorage.userToken}`,
    },
  });

  return await fetch(request).then(handleResponse).catch(handleError);
}

//Priorities Chart
export async function getPrioritiesStatisticsCharts(filterQuery) {
  const { from, to, employeeId, categoryId } = filterQuery;
  let requestUrl = `${baseUrl}/stats/priorities?`;
  let cat = qs.stringify({ categoryId: categoryId }, { indices: false });

  if (from) requestUrl += `&from=${from}`;
  if (to) requestUrl += `&to=${to}`;
  if (employeeId) requestUrl += `&employeeId=${employeeId}`;
  if (categoryId) requestUrl += `&${cat}`;
  const request = new Request(requestUrl, {
    headers: {
      authorization: `bearer ${localStorage.userToken}`,
    },
  });

  return await fetch(request).then(handleResponse).catch(handleError);
}

//Employee Tasks In Category Table
export async function getEmployeeTasksInCategoryStatisticsTable(
  pageNumber,
  itemsPerPage,
  filterQuery
) {
  const { from, to, employeeId, categoryId } = filterQuery;
  let cat = qs.stringify({ categoryId: categoryId }, { indices: false });

  let requestUrl = `${baseUrl}/stats/tasks/employee?employeeId=${employeeId}`;
  if (pageNumber) requestUrl += `&pageNumber=${pageNumber}`;
  if (from) requestUrl += `&from=${from}`;
  if (to) requestUrl += `&to=${to}`;
  if (categoryId) requestUrl += `&${cat}`;

  if (itemsPerPage) requestUrl += `&itemsPerPage=${itemsPerPage}`;

  const request = new Request(requestUrl, {
    headers: {
      authorization: `bearer ${localStorage.userToken}`,
    },
  });

  return await fetch(request).then(handleResponse).catch(handleError);
}
// // for first item in pages 15 & 16
// export async function getCategoriesCount() {
//   const request = new Request(baseUrl + "/categories/tasksCount");
//   return await fetch(request).then(handleResponse).catch(handleError);
// }

// // for subtasks pie chart in pages 15 & 16
// export async function getTasksStatusCount() {
//   const request = new Request(baseUrl + "/tasks/statusCount");
//   return await fetch(request).then(handleResponse).catch(handleError);
// }

// // for bottom table in page 16
// export async function getEmployeesTasksCount() {
//   const request = new Request(baseUrl + "/employees/tasksCount");
//   return await fetch(request).then(handleResponse).catch(handleError);
// }

// // for table in page 17
// export async function getFinishedTasksStatsByCategory(categoryId) {
//   const request = new Request(
//     `${baseUrl}/category/${categoryId}/tasks/finishedStats`
//   );
//   return await fetch(request).then(handleResponse).catch(handleError);
// }

// // for pie chart in page 17
// export async function getTasksStatusCountByCategory(categoryId) {
//   const request = new Request(
//     `${baseUrl}/category/${categoryId}/tasks/statusCount`
//   );
//   return await fetch(request).then(handleResponse).catch(handleError);
// }
