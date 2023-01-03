const jsf = require("json-schema-faker");
const faker = require("faker");
const momentHijri = require("moment-hijri");

momentHijri.locale("en-US");

jsf.extend("faker", () => {
  faker.locale = "en";

  faker.custom = {
    // use past, recent, soon or future here in place of t
    hijri: (t, yrsOrDays, refDate, dateOnly = true) =>
      momentHijri(faker.date[t](yrsOrDays, refDate)).format(
        dateOnly ? "iYYYY/iMM/iDD" : "iYYYY/iMM/iDD HH:mm:ss"
      ),
  };
  return faker;
});

jsf.option({
  resolveJsonPath: true,
  //alwaysFakeOptionals: true,
});

module.exports = {
  jsf,
  faker,
};
