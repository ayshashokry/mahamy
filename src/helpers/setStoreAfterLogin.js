import { canUserObtainManagerStuff } from "../api/adminApi";
import { getCategories, getFlatCategories } from "../api/categoriesApi";
import { getOutputs } from "../api/taskOutputsApi";
import { getPriorities } from "../api/prioritiesApi";
import { getStatuses } from "../api/statusApi";
import { getTasks, getTeamsTasks } from "../api/tasksApi";
import { getGroups } from "../api/groupsApi";

const setStoreAfterLogin = async (props, userType) => {
  props.startTasksLoading();
  if (!userType) userType = await canUserObtainManagerStuff();
  props.adminOrEmployee(userType);
  const flatCategories = await getFlatCategories();
  props.getFlatCategoriesList(flatCategories);
  const outputs = await getOutputs();
  props.getOutputsList(outputs);
  const categories = await getCategories();
  props.getCategoriesList(categories);
  const priorities = await getPriorities();
  props.getPrioritiesList(priorities);
  const statuses = await getStatuses();
  props.getStatusList(statuses);
  const tasks = await getTasks();
  props.getTasksList(tasks);
  const groups = await getGroups();
  props.getGroupsList(groups);
  if (
    userType === "manager" ||
    userType === "director" ||
    userType === "admin"
  ) {
    const teamsTasks = await getTeamsTasks();
    props.getTeamTasksList(teamsTasks);
  }
  props.finishTasksLoading();
};

export default setStoreAfterLogin;
