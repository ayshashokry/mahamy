const getRootCategoryName = (
  categoryId,
  categoriesParentMap,
  categoriesNameMap
) => {
  let currentCategoryId = categoryId;
  let parentCategoryId = categoriesParentMap[currentCategoryId];
  if (parentCategoryId === null) return null;
  while (parentCategoryId !== null) {
    currentCategoryId = parentCategoryId;
    parentCategoryId = categoriesParentMap[currentCategoryId];
  }
  const rootCategoryId = currentCategoryId;
  const rootCategoryName = categoriesNameMap[rootCategoryId];

  return rootCategoryName;
};

export default getRootCategoryName;
