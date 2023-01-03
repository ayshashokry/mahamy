const fs = require("fs");
const path = require("path");
const mockData = require("./mockData");

const {
  groups,
  categories,
  priorities,
  outputs,
  status,
  users,
  tasks,
  comments,
  categoriesCount,
  tasksStatusCount,
  employeesStats,
  finishedTasksStatsByCategory,
  tasksStatusCountByCategory,
  employeesStatsByCategory,
} = mockData;

const data = JSON.stringify({
  groups,
  categories,
  priorities,
  outputs,
  status,
  users,
  tasks,
  comments,
  categoriesCount,
  tasksStatusCount,
  employeesStats,
  finishedTasksStatsByCategory,
  tasksStatusCountByCategory,
  employeesStatsByCategory,
});
const filepath = path.join(__dirname, "db.json");

fs.writeFile(filepath, data, (err) => {
  return err ? console.log(err) : "Mock DB created";
});
