/* Each category in the categories array must have an id and parentCategoryId */
export function createTreeFromFlatArray(categories) {
  if (categories.length === 0) return [];

  const parentChildrenMap = getCategoriesParentChildrenMap(categories);
  const rootCategoriesIds = getRootCategoriesIds(categories);

  // Create a dictionary for categories
  let categoriesDict = {};
  categories.forEach((c) => {
    categoriesDict[c.id] = c;
  });

  // Create a dictionary for root categories
  let rootCategories = {};
  rootCategoriesIds.forEach((id) => {
    rootCategories[id] = categoriesDict[id];
  });

  // setChildren is a recursive function, so it will set the children
  // for the whole tree
  rootCategoriesIds.forEach((id) => {
    setChildren(id, categoriesDict, rootCategories, parentChildrenMap);
  });

  return Object.values(rootCategories);
}

function getCategoriesParentChildrenMap(categories) {
  let parentChildrenMap = {};
  categories.forEach((c) => {
    if (c.parentCategoryId) {
      let children = parentChildrenMap[c.parentCategoryId];
      if (!children) children = [];
      children.push(c.id);
      parentChildrenMap[c.parentCategoryId] = children;
    }
  });

  // Throw error if there is a loop in the tree. This is known
  // if an element is found twice or more in the tree
  const rootCategoriesIds = getRootCategoriesIds(categories);
  const treeNodes = rootCategoriesIds.concat(
    ...Object.values(parentChildrenMap)
  );
  if (treeNodes.length !== new Set(treeNodes).size)
    throw new Error("The tree has at least one loop");

  return parentChildrenMap;
}

function getRootCategoriesIds(categories) {
  let rootCategoriesIds = [];
  categories.forEach((c) => {
    if (c.parentCategoryId === null) rootCategoriesIds.push(c.id);
  });
  if (rootCategoriesIds.length === 0)
    throw new Error("No root categories found");

  //Check uniqueness if elements in the rootCategoriesIds array
  if (rootCategoriesIds.length !== new Set(rootCategoriesIds).size)
    throw new Error("Root categories aren't unique");

  return rootCategoriesIds;
}

function setChildren(
  parentCategoryId,
  categoriesDict,
  rootCategories,
  parentChildrenMap
) {
  const childrenIds = parentChildrenMap[parentCategoryId];
  if (!childrenIds) return;
  const childrenCategories = {};
  childrenIds.forEach((cid) => {
    childrenCategories[cid] = categoriesDict[cid];
  });
  rootCategories[parentCategoryId].children = Object.values(childrenCategories);
  childrenIds.forEach((cid) =>
    setChildren(cid, categoriesDict, childrenCategories, parentChildrenMap)
  );
}
