const mockDataConfig = require("./mockDataConfig");

const { faker } = mockDataConfig;

function populateRandomStatusEmployee(emp) {
  const randomStatus = Math.ceil(Math.random() * 3);
  const empPopulationFuncs = {
    1: populateNotStartedYetEmployee,
    2: populateBeingProcesedEmployee,
    3: populateFinishedEmployee,
  };
  empPopulationFuncs[randomStatus](emp);
}

function populateNotStartedYetEmployee(emp) {
  emp.status = 1;
}

function populateBeingProcesedEmployee(emp) {
  emp.status = 2;
  emp.startedOn = faker.custom.hijri("past", 0.25);
}

function populateFinishedEmployee(emp) {
  emp.status = 3;
  emp.startedOn = faker.custom.hijri("past", 0.25);
  emp.finishedOn = faker.custom.hijri("future", 0.25);
}

function generateUniqueRandomNumbersArray(from, to, arraySize) {
  if (isNaN(from) || isNaN(to) || isNaN(arraySize))
    throw new Error("from, to and arraySize must be numbers");
  if (arraySize <= 0) throw new Error("arraySize must be greater than zero");
  if (from > to) throw new Error("'from' must be less than or equal 'to'");

  const numbersSpan = to - from + 1;
  if (numbersSpan < arraySize)
    throw new Error(
      `Can't satisfy uniqueness with numbers from ${from} to ${to} for an array of size ${arraySize}`
    );

  let numbersPool = Array.from({ length: numbersSpan }, (e, i) => i + from);
  let outputArray = [];
  let randomIndex = Number(),
    selectedElement = Number();
  do {
    randomIndex = Math.floor(numbersPool.length * Math.random());
    selectedElement = numbersPool.splice(randomIndex, 1)[0];
    outputArray.push(selectedElement);
    arraySize--;
  } while (arraySize > 0);

  return outputArray;
}

module.exports = {
  populateRandomStatusEmployee,
  populateNotStartedYetEmployee,
  populateBeingProcesedEmployee,
  populateFinishedEmployee,
  generateUniqueRandomNumbersArray,
};
