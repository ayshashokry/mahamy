import {
  GET_CATEGORIES,
  ADD_CATEGORY,
  GET_FLAT_CATEGORIES,
  DELETE_CATEGORY,
  EDIT_CATEGOTY,
} from "../actions/rootActions";
import { createTreeFromFlatArray } from "../../api/helper/createTree";
const intialState = {
  Categories: [],
  FlatCategories: [],
  CategoriesParentMap: {},
  CategoriesNameMap: {},
};

const CategoriesReducer = (state = intialState, action) => {
  switch (action.type) {
    case GET_CATEGORIES: {
      return { ...state, Categories: action.payload };
    }
    case GET_FLAT_CATEGORIES: {
      const categories = action.payload;
      let CategoriesParentMap = {};
      categories.forEach((c) => {
        CategoriesParentMap[c.id] = c.parentCategoryId;
      });
      let CategoriesNameMap = {};
      categories.forEach((c) => {
        CategoriesNameMap[c.id] = c.name;
      });
      return {
        ...state,
        FlatCategories: categories,
        CategoriesParentMap,
        CategoriesNameMap,
      };
    }
    case ADD_CATEGORY: {
      state.FlatCategories.push(action.payload);
      return {
        ...state,
        Categories: createTreeFromFlatArray(state.FlatCategories),
      };
    }
    case DELETE_CATEGORY: {
      console.log(action.payload);
      const categoryId = Number(action.payload);
      const categories = state.Categories.filter((c) => c.id !== categoryId);
      const flatCategories = state.FlatCategories.filter(
        (c) => c.id !== categoryId
      );
      return {
        ...state,
        Categories: categories,
        FlatCategories: flatCategories,
      };
    }
    case EDIT_CATEGOTY: {
      const remainCategories = state.FlatCategories.filter(
        (task) => task.id !== action.payload.id
      );
      const categoryIndex = state.FlatCategories.findIndex(
        (el) => el.id === action.payload.id
      );
      const category = state.FlatCategories[categoryIndex];
      remainCategories.splice(
        categoryIndex,
        0,
        action.operation === "patch"
          ? { ...category, ...action.payload }
          : action.payload
      );

      return {
        ...state,
        FlatCategories: remainCategories,
        Categories: createTreeFromFlatArray(remainCategories),
      };
    }

    default:
      return state;
  }
};
export default CategoriesReducer;
