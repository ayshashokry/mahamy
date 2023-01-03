const mockDataConfig = require("./mockDataConfig");
const mockDataHelper = require("./mockDataHelper");

const { jsf, faker } = mockDataConfig;

const {
  populateRandomStatusEmployee,
  populateNotStartedYetEmployee,
  populateBeingProcesedEmployee,
  populateFinishedEmployee,
  generateUniqueRandomNumbersArray,
} = mockDataHelper;

const groups = [
  { id: 1, name: "الدعم الفني" },
  { id: 2, name: "مدير الدعم الفني" },
  { id: 3, name: "المراجعون" },
  { id: 4, name: "الاستشاريون" },
  { id: 5, name: "مدير الإدارة" },
];

const categories = [
  {
    id: 1,
    name: "مهمة رئيسية 1",
    parentCategoryId: null,
    canView: false,
    canManage: true,
  },
  {
    id: 2,
    name: "مهمة رئيسية 1أ",
    parentCategoryId: 1,
    canView: true,
    canManage: true,
  },
  {
    id: 3,
    name: "مهمة رئيسية 1ب",
    parentCategoryId: 1,
    canView: true,
    canManage: true,
  },
  {
    id: 4,
    name: "مهمة رئيسية 1أ-أ",
    parentCategoryId: 2,
    canView: true,
    canManage: true,
  },
  {
    id: 5,
    name: "مهمة رئيسية 1أ-ب",
    parentCategoryId: 2,
    canView: true,
    canManage: true,
  },
  {
    id: 6,
    name: "مهمة رئيسية 2",
    parentCategoryId: null,
    canView: true,
    canManage: true,
  },
];

categories.forEach((c) => {
  c.groups = generateUniqueRandomNumbersArray(
    1,
    5,
    Math.random() < 0.5 ? 2 : 3
  );
});

const priorities = [
  { id: 1, name: "عادي" },
  { id: 2, name: "عاجل" },
  { id: 3, name: "سري" }
];

const outputs = [
  { id: 1, name: "دراسة" },
  { id: 2, name: "تقرير" },
  { id: 3, name: "إفادة" },
  { id: 4, name: "تحديث بيانات" },
  { id: 5, name: "حفظ" },
  { id: 6, name: "متابعة" },
];

const status = [
  { id: 1, name: "تحت الإنتظار" },
  { id: 2, name: "قيد التنفيذ" },
  { id: 3, name: "مكتملة" },
];

const schema = {
  type: "object",
  properties: {
    users: {
      type: "array",
      minItems: 10,
      maxItems: 30,
      items: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            autoIncrement: true,
            minimum: 1,
            maximum: 1000,
          },
          name: { type: "string", faker: "name.findName" },
          groupId: { type: "integer", minimum: 1, maximum: 5 },
        },
        required: ["id", "name", "groupId"],
      },
    },
    tasks: {
      type: "array",
      minItems: 3,
      maxItems: 300,
      items: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            autoIncrement: true,
            minimum: 1,
            maximum: 1000,
          },
          name: { type: "string", faker: "lorem.words" },
          categoryId: { type: "integer", minimum: 1, maximum: 6 },
          dueDate: { type: "string", faker: { "custom.hijri": ["soon", 5] } },
          priorityId: {
            type: "integer",
            minimum: 1,
            maximum: 3,
          },
          outputs: {
            type: "array",
            minItems: 1,
            maxItems: 3,
            items: {
              type: "integer",
              // unique: true,
              minimum: 1,
              maximum: 6,
            },
          },
          employees: {
            type: "array",
            minItems: 1,
            maxItems: 3,
            items: {
              type: "object",
              unique: true,
              properties: {
                employeeId: { type: "integer", jsonPath: "$..users[*].id" },
                // employeeName: { type: "string", jsonPath: "$..users[*].name" },
                // groupId: { type: "string", jsonPath: "$..users[*].groupId" },
              },
              required: ["employeeId", "employeeName"],
            },
          },
          description: { type: "string", faker: "lorem.paragraph" },
          // notes: { type: "string", faker: "lorem.sentences" },
          hasQA: { type: "boolean" },
          attachments: {
            type: "array",
            minItems: 1,
            maxItems: 4,
            items: { type: "string", faker: "system.commonFileName" },
          },
          status: { type: "integer", minimum: 1, maximum: 3 },
          // isArchived: { type: "boolean" },
        },
        required: [
          "id",
          "name",
          "categoryId",
          "dueDate",
          "priorityId",
          "outputs",
          "employees",
          "description",
          "isQA",
          "status",
        ],
      },
    },
    comments: {
      type: "array",
      maxItems: 1000,
      items: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            autoIncrement: true,
            minimum: 1,
            maximum: 10000,
          },
          comment: { type: "string", faker: "lorem.sentence" },
          employeeName: {
            type: "string",
            jsonPath: "$..users[*].name",
          },
          createdOn: {
            type: "string",
            faker: { "custom.hijri": ["recent", undefined, undefined, false] },
          },
          taskId: {
            type: "integer",
            jsonPath: "$..tasks[*].id",
          },
          attachments: {
            type: "array",
            maxItems: 2,
            items: { type: "string", faker: "system.commonFileName" },
          },
        },
        required: ["id", "comment", "employeeName", "createdOn", "taskId"],
      },
    },
  },
  required: ["users", "tasks", "comments"],
};

const { users, tasks, comments } = jsf.generate(schema);

let usersDict = {};
users.forEach((u) => {
  usersDict[u.id] = u;
});

tasks.forEach((t) => {
  // check if task is finished
  if (t.status === 3) {
    t.employees.forEach((e) => {
      populateFinishedEmployee(e);
    });
    t.isArchived = faker.random.boolean();
    t.archivingDate = faker.date.soon();
  } else {
    t.isArchived = false;
  }

  //check if task is being processed
  if (t.status === 2) {
    t.employees.forEach((e, index) => {
      if (index === 0) {
        populateBeingProcesedEmployee(e);
      } else {
        populateRandomStatusEmployee(e);
      }
    });
  }

  //check if task not yet started
  if (t.status === 1) {
    t.employees.forEach((e) => {
      populateNotStartedYetEmployee(e);
    });
  }

  //fill employeeName and groupId for employees
  t.employees.forEach((e) => {
    const id = e.employeeId;
    e.employeeName = usersDict[id].name;
    e.groupId = usersDict[id].groupId;
  });
});

const categoriesCount = [
  { id: 1, name: "firstCategory", tasksCount: 20, finishedCount: 3 },
  { id: 2, name: "secondCategory", tasksCount: 20, finishedCount: 3 },
  { id: 3, name: "thirdCategory", tasksCount: 20, finishedCount: 3 },
];

const tasksStatusCount = {
  fresh: 20,
  current: 50,
  delayed: 10,
  finished: 100,
  archived: 300,
};

const employeesStats = [
  { id: 1, name: "Abc", beforeDue: 23, onDue: 3, afterDue: 2 },
  { id: 2, name: "Asg", beforeDue: 23, onDue: 3, afterDue: 2 },
  { id: 3, name: "Aty", beforeDue: 23, onDue: 3, afterDue: 2 },
  { id: 4, name: "Vrh", beforeDue: 23, onDue: 3, afterDue: 2 },
  { id: 5, name: "Mkl", beforeDue: 23, onDue: 3, afterDue: 2 },
];

const finishedTasksStats = [
  { id: 1, name: "first task", evaluation: "before", employeesCount: 3 },
  { id: 2, name: "second task", evaluation: "on", employeesCount: 6 },
  { id: 3, name: "third task", evaluation: "after", employeesCount: 1 },
];

const finishedTasksStatsByCategory = [
  { id: 1, name: "first category", finishedTasksStats },
  { id: 2, name: "second category", finishedTasksStats },
  { id: 3, name: "third category", finishedTasksStats },
];

const tasksStatusCountByCategory = [
  {
    id: 1,
    name: "first category",
    fresh: 20,
    current: 40,
    delayed: 10,
    finished: 60,
    archived: 50,
  },
  {
    id: 2,
    name: "second category",
    fresh: 20,
    current: 40,
    delayed: 10,
    finished: 60,
    archived: 300,
  },
  {
    id: 3,
    name: "third category",
    fresh: 20,
    current: 40,
    delayed: 10,
    finished: 60,
    archived: 100,
  },
];

const employeesStatsByCategory = [
  {
    id: 1,
    name: "First Category",
    employees: [
      { id: 1, name: "Abc", beforeDue: 23, onDue: 3, afterDue: 2 },
      { id: 2, name: "Asg", beforeDue: 23, onDue: 3, afterDue: 2 },
      { id: 3, name: "Aty", beforeDue: 23, onDue: 3, afterDue: 2 },
      { id: 4, name: "Vrh", beforeDue: 23, onDue: 3, afterDue: 2 },
      { id: 5, name: "Mkl", beforeDue: 23, onDue: 3, afterDue: 2 },
    ],
  },
  {
    id: 1,
    name: "Second Category",
    employees: [
      { id: 1, name: "Abc", beforeDue: 23, onDue: 3, afterDue: 2 },
      { id: 2, name: "Asg", beforeDue: 23, onDue: 3, afterDue: 2 },
      { id: 3, name: "Aty", beforeDue: 23, onDue: 3, afterDue: 2 },
      { id: 4, name: "Vrh", beforeDue: 23, onDue: 3, afterDue: 2 },
      { id: 5, name: "Mkl", beforeDue: 23, onDue: 3, afterDue: 2 },
    ],
  },
];

// Using CommonJS style export, so we can consume via Node (without using Babel-node)
module.exports = {
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
};
