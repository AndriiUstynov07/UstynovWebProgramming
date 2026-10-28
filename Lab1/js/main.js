import { randomUserMock, additionalUsers } from "./FE4U-Lab2-mock.js";
import { formatUsers, filterUsers, sortUsers, findUser, getPercentage } from "./lab2.js";

const ROWS_ON_PAGE = 10;
const FAVORITES_ON_SCREEN = 5;

// Завдання 1: готовий масив користувачів
const users = formatUsers(randomUserMock, additionalUsers);

// поточний стан сторінки
let sortField = "full_name";
let sortOrder = "asc";
let currentPage = 1;
let favoriteStart = 0;
let openedUser = null;

// ---------- допоміжні функції ----------

function getInitials(user) {
  const parts = user.full_name.split(" ");
  const first = parts[0][0];
  const last = parts[parts.length - 1][0];
  return first + "." + last;
}

function findUserById(id) {
  for (const user of users) {
    if (user.id === id) {
      return user;
    }
  }
  return null;
}

// картка викладача (для сітки і для Favorites)
function createCardHtml(user, showCourse) {
  let avatar = "";
  if (user.picture_large) {
    avatar = '<img class="avatar" src="' + user.picture_large + '" alt="">';
  } else {
    avatar = '<div class="avatar initials">' + getInitials(user) + "</div>";
  }

  if (user.favorite) {
    avatar = '<div class="star-wrap">' + avatar + '<span class="star">&#9733;</span></div>';
  }

  let html = '<a href="#info-popup" class="teacher" data-id="' + user.id + '">';
  html += avatar;
  html += "<h3>" + user.full_name + "</h3>";
  if (showCourse) {
    html += '<p class="spec">' + user.course + "</p>";
  }
  html += '<p class="country">' + user.country + "</p>";
  html += "</a>";
  return html;
}

// ---------- фільтри (Завдання 3 і 6) ----------

function getFilters() {
  const filters = {};

  const age = document.getElementById("age").value;
  if (age !== "") {
    const parts = age.split("-");
    filters.age = { gt: Number(parts[0]) - 1, lt: Number(parts[1]) + 1 };
  }

  const country = document.getElementById("country").value;
  if (country !== "") {
    filters.country = country;
  }

  const sex = document.getElementById("sex").value;
  if (sex !== "") {
    filters.gender = sex;
  }

  if (document.getElementById("photo").checked) {
    filters.photo = true;
  }
  if (document.getElementById("fav").checked) {
    filters.favorite = true;
  }
  return filters;
}

function fillCountries() {
  const countries = [];
  for (const user of users) {
    if (user.country && !countries.includes(user.country)) {
      countries.push(user.country);
    }
  }
  countries.sort();

  const select = document.getElementById("country");
  for (const country of countries) {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    select.appendChild(option);
  }
}

// ---------- малювання сторінки ----------

function renderTeachers() {
  const filters = getFilters();
  const found = filterUsers(users, filters);

  let html = "";
  for (const user of found) {
    html += createCardHtml(user, true);
  }
  document.getElementById("teachers").innerHTML = html;

  // Завдання 6: відсоток користувачів, що підійшли під фільтри
  const percent = getPercentage(users, filters);
  document.getElementById("filter-info").textContent =
    "Found " + found.length + " of " + users.length + " (" + percent.toFixed(1) + "%)";
}

// Завдання 4: таблиця з сортуванням
function renderTable() {
  const sorted = sortUsers(users, sortField, sortOrder);
  const pagesCount = Math.ceil(sorted.length / ROWS_ON_PAGE);
  if (currentPage > pagesCount) {
    currentPage = pagesCount;
  }

  const start = (currentPage - 1) * ROWS_ON_PAGE;
  const pageUsers = sorted.slice(start, start + ROWS_ON_PAGE);

  let rows = "";
  for (const user of pageUsers) {
    const age = user.age === undefined ? "-" : user.age;
    rows += "<tr><td>" + user.full_name + "</td><td>" + user.course + "</td><td>" + age +
      "</td><td>" + user.gender + "</td><td>" + user.country + "</td></tr>";
  }
  document.getElementById("stats-body").innerHTML = rows;

  let pager = "";
  for (let page = 1; page <= pagesCount; page++) {
    const style = page === currentPage ? ' style="font-weight: 700;"' : "";
    pager += '<a href="#stats" data-page="' + page + '"' + style + ">" + page + "</a>";
  }
  document.getElementById("pager").innerHTML = pager;
}

function renderFavorites() {
  const favorites = filterUsers(users, { favorite: true });
  let html = "";

  if (favorites.length <= FAVORITES_ON_SCREEN) {
    for (const user of favorites) {
      html += createCardHtml(user, false);
    }
  } else {
    for (let i = 0; i < FAVORITES_ON_SCREEN; i++) {
      const index = (favoriteStart + i) % favorites.length;
      html += createCardHtml(favorites[index], false);
    }
  }
  document.getElementById("fav-row").innerHTML = html;
}

function renderAll() {
  renderTeachers();
  renderTable();
  renderFavorites();
}

// ---------- popup з інформацією про викладача ----------

function createPlaceholder(user) {
  const color = user.bg_color ? user.bg_color : "#888888";
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="294" height="294">' +
    '<rect width="294" height="294" fill="' + color + '"/>' +
    '<text x="147" y="170" font-size="80" font-family="Arial" fill="#ffffff" text-anchor="middle">' +
    getInitials(user) + "</text></svg>";
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function showInfo(user) {
  openedUser = user;

  document.getElementById("info-photo").src = user.picture_large ? user.picture_large : createPlaceholder(user);
  document.getElementById("info-name").textContent = user.full_name;
  document.getElementById("info-course").textContent = user.course;
  document.getElementById("info-place").textContent = user.city + ", " + user.country;

  let ageText = user.gender;
  if (user.age !== undefined) {
    ageText = user.age + ", " + user.gender;
  }
  document.getElementById("info-age").textContent = ageText;

  const email = document.getElementById("info-email");
  email.textContent = user.email ? user.email : "";
  email.href = user.email ? "mailto:" + user.email : "#";

  document.getElementById("info-phone").textContent = user.phone ? user.phone : "";
  document.getElementById("info-note").textContent = user.note;
  document.getElementById("info-star").innerHTML = user.favorite ? "&#9733;" : "&#9734;";
}

function onTeacherClick(event) {
  const card = event.target.closest(".teacher");
  if (card === null) {
    return;
  }
  const user = findUserById(card.dataset.id);
  if (user !== null) {
    showInfo(user);
  }
}

// ---------- обробники подій ----------

function onStarClick() {
  if (openedUser === null) {
    return;
  }
  openedUser.favorite = !openedUser.favorite;
  showInfo(openedUser);
  renderTeachers();
  renderFavorites();
}

function onTableHeaderClick(event) {
  const field = event.target.dataset.field;
  if (field === undefined) {
    return;
  }
  if (field === sortField) {
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
  } else {
    sortField = field;
    sortOrder = "asc";
  }
  currentPage = 1;
  renderTable();
}

function onPagerClick(event) {
  const page = event.target.dataset.page;
  if (page === undefined) {
    return;
  }
  currentPage = Number(page);
  renderTable();
}

// Завдання 5: пошук за name, note або age
function onSearch(event) {
  event.preventDefault();
  const text = document.getElementById("search-input").value.trim();
  if (text === "") {
    return;
  }

  let user = null;
  if (!isNaN(text)) {
    user = findUser(users, "age", Number(text));
  } else {
    user = findUser(users, "name", text);
    if (user === null) {
      user = findUser(users, "note", text);
    }
  }

  if (user === null) {
    document.getElementById("filter-info").textContent = 'Nothing found for "' + text + '"';
    window.location.hash = "#top";
    return;
  }
  showInfo(user);
  window.location.hash = "#info-popup";
}

function moveFavorites(step) {
  const favorites = filterUsers(users, { favorite: true });
  if (favorites.length <= FAVORITES_ON_SCREEN) {
    return;
  }
  favoriteStart = (favoriteStart + step + favorites.length) % favorites.length;
  renderFavorites();
}

function init() {
  fillCountries();
  renderAll();

  const filterIds = ["age", "country", "sex", "photo", "fav"];
  for (const id of filterIds) {
    document.getElementById(id).addEventListener("change", renderTeachers);
  }

  document.getElementById("teachers").addEventListener("click", onTeacherClick);
  document.getElementById("fav-row").addEventListener("click", onTeacherClick);
  document.querySelector(".stats thead").addEventListener("click", onTableHeaderClick);
  document.getElementById("pager").addEventListener("click", onPagerClick);
  document.getElementById("info-star").addEventListener("click", onStarClick);
  document.getElementById("info-star").style.cursor = "pointer";
  document.getElementById("search-form").addEventListener("submit", onSearch);
  document.getElementById("fav-prev").addEventListener("click", function () { moveFavorites(-1); });
  document.getElementById("fav-next").addEventListener("click", function () { moveFavorites(1); });
}

init();