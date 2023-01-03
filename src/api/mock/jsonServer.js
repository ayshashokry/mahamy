/*
As the server is started from this file, you can't pass json-server command line options.
Instead, override some defaults by passing a config object to jsonServer.defaults() if needed.
*/

const jsonServer = require("json-server");
const server = jsonServer.create();
const path = require("path");
const router = jsonServer.router(path.join(__dirname, "db.json"));

const middlewares = jsonServer.defaults({
  // Display json-server's built-in homepage on start
  static: "node_modules/json-server/public",
});
server.use(middlewares);

// To handle POST, PUT and DELETE
server.use(jsonServer.bodyParser);

// Simulate delay on all requests
server.use((req, res, next) => {
  setTimeout(next, 0);
});

// Declare custom routes here before default router
server.use(
  jsonServer.rewriter({
    "/tasks": "/tasks?isArchived=false",
    "/tasks/category/:categoryId": "/tasks?categoryId=:categoryId",
    "/categories/tasksCount": "/categoriesCount",
    "/tasks/statusCount": "/tasksStatusCount",
    "/employees/tasksCount": "/employeesStats",
    "/category/:categoryId/tasks/finishedStats":
      "/finishedTasksStatsByCategory/:categoryId",
    "/category/:categoryId/tasks/statusCount":
      "/tasksStatusCountByCategory/:categoryId",
  })
);

server.use((req, res, next) => {
  mapQueryNames(req);
  next();
});

const mapQueryNames = (request) => {
  const map = {
    pageNumber: "_page",
    pageLimit: "_limit",
    // fromArchivingDate: "archivingDate_gte",
    // toArchivingDate: "archivingDate_lte",
  };
  const query = request.query;
  if (query) {
    Object.keys(map).forEach((k) => {
      query[map[k]] = query[k];
    });
  }
};

// Use default router
server.use(router);

// Start server
const port = 3001;
server.listen(port, () => {
  console.log("JSON Server is running on port " + port);
});
