// Завдання 5: звіт у WebDataRocks (@webdatarocks/webdatarocks, глобальна змінна WebDataRocks)
// Дві таблиці на одному місці: зведений звіт за країнами і плоска таблиця всіх викладачів.

import { sortUsers } from "./lab2.js";

let pivot = null;
let currentMode = "countries";

// Назви ключів об'єкта = назви колонок, які бачить користувач
const FIELDS = ["Name", "Speciality", "Age", "Gender", "Country", "City", "Birth date", "Email", "Phone"];

// перший елемент масиву задає типи даних, далі йдуть самі рядки
function createReportData(users) {
  const types = {
    "Name": { type: "string" },
    "Speciality": { type: "string" },
    "Age": { type: "number" },
    "Gender": { type: "string" },
    "Country": { type: "string" },
    "City": { type: "string" },
    "Birth date": { type: "date string" },
    "Email": { type: "string" },
    "Phone": { type: "string" },
  };

  const sorted = sortUsers(users, "full_name");
  const rows = _.map(sorted, function (user) {
    // _.omitBy прибирає порожні поля (наприклад, якщо немає дати народження)
    return _.omitBy({
      "Name": user.full_name,
      "Speciality": user.course,
      "Age": user.age,
      "Gender": user.gender,
      "Country": user.country,
      "City": user.city,
      "Birth date": user.b_day ? String(user.b_day).slice(0, 10) : undefined,
      "Email": user.email,
      "Phone": user.phone,
    }, _.isUndefined);
  });

  return [types].concat(rows);
}

// звіт за країнами: кількість викладачів і середній вік
function getCountriesReport(users) {
  return {
    dataSource: { data: createReportData(users) },
    slice: {
      rows: [{ uniqueName: "Country" }],
      columns: [{ uniqueName: "[Measures]" }],
      measures: [
        { uniqueName: "Name", aggregation: "count", caption: "Teachers" },
        { uniqueName: "Age", aggregation: "average", caption: "Average age", format: "oneDecimal" },
      ],
    },
    formats: [{ name: "oneDecimal", decimalPlaces: 1 }],
    options: { grid: { type: "compact" } },
  };
}

// плоска таблиця: кожен викладач - окремий рядок
function getFlatReport(users) {
  const rows = _.map(FIELDS, function (field) {
    return { uniqueName: field };
  });
  return {
    dataSource: { data: createReportData(users) },
    slice: { rows: rows, flatOrder: FIELDS },
    options: { grid: { type: "flat", showTotals: "off", showGrandTotals: "off" } },
  };
}

function getReport(mode, users) {
  return mode === "flat" ? getFlatReport(users) : getCountriesReport(users);
}

// створює таблицю при першому виклику, а потім тільки оновлює дані
function updateReport(users) {
  if (typeof WebDataRocks === "undefined") {
    return;
  }

  if (pivot === null) {
    pivot = new WebDataRocks({
      container: "#pivot",
      toolbar: true,
      width: "100%",
      height: 480,
      report: getReport(currentMode, users),
    });
  } else {
    pivot.setReport(getReport(currentMode, users));
  }
}

// перемикач: "countries" або "flat"
function setReportMode(mode, users) {
  currentMode = mode;
  document.getElementById("report-countries").classList.toggle("active", mode === "countries");
  document.getElementById("report-flat").classList.toggle("active", mode === "flat");
  updateReport(users);
}

export { updateReport, setReportMode };
