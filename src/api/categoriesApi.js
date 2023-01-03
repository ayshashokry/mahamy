import { handleError, handleResponse } from "./apiCommonUtils";
import {  baseUrl } from "./baseUrl";
import { createTreeFromFlatArray } from "./helper/createTree";

const categoriesBaseUrl = baseUrl + "/categories/";

export async function getCategories() {
  const request = new Request(categoriesBaseUrl, {
    headers: {
      authorization: `bearer ${localStorage.userToken}`,
    },
  });
  const response = await fetch(request);
  if (response.ok) {
    const categoriesArray = await response.json();

    const categoriesTree = createTreeFromFlatArray(categoriesArray);
    return categoriesTree;
  }
}
export async function getFlatCategories() {
  const request = new Request(categoriesBaseUrl, {
    headers: {
      authorization: `bearer ${localStorage.userToken}`,
    },
  });
  const response = await fetch(request);
  if (response.ok) {
    const categoriesArray = await response.json();
    return categoriesArray;
  }
}

export async function getSingleCategory(categoryId) {
  const request = new Request(categoriesBaseUrl + categoryId, {
    headers: {
      authorization: `bearer ${localStorage.userToken}`,
    },
  });
  return await fetch(request).then(handleResponse).catch(handleError);
}

export async function saveCategory(category) {
  const request = new Request(categoriesBaseUrl + (category.id || ""), {
    method: category.id ? "PUT" : "POST",
    headers: {
      "content-type": "application/json",
      authorization: `bearer ${localStorage.userToken}`,
    },
    body: JSON.stringify(category),
  });
  return await fetch(request).then(handleResponse).catch(handleError);
}

export async function deleteCategory(categoryId) {
  const request = new Request(categoriesBaseUrl + categoryId, {
    method: "DELETE",
    headers: {
      authorization: `bearer ${localStorage.userToken}`,
    },
  });
  return await fetch(request).then(handleResponse).catch(handleError);
}
