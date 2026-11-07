// Завдання 3 (Lab 5): функції переписані з використанням бібліотеки lodash.
// lodash підключений в index.html звичайним <script>, тому змінна `_` доступна глобально.

const COURSES = [
  "Mathematics", "Physics", "English", "Computer Science", "Dancing", "Chess",
  "Biology", "Chemistry", "Law", "Art", "Medicine", "Statistics",
];

// формати телефонів для кожної країни (9 = цифра)
const PHONE_FORMATS = {
  "Germany": /^\d{4}-\d{7}$/,
  "Ireland": /^\d{3}-\d{3}-\d{4}$/,
  "Australia": /^\d{2}-\d{4}-\d{4}$/,
  "United States": /^\(\d{3}\)-\d{3}-\d{4}$/,
  "Finland": /^\d{2}-\d{3}-\d{3}$/,
  "Turkey": /^\(\d{3}\)-\d{3}-\d{4}$/,
  "Switzerland": /^\d{3} \d{3} \d{2} \d{2}$/,
  "New Zealand": /^\(\d{3}\)-\d{3}-\d{4}$/,
  "Spain": /^\d{3}-\d{3}-\d{3}$/,
  "Norway": /^\d{8}$/,
  "Denmark": /^\d{8}$/,
  "Iran": /^\d{3}-\d{8}$/,
  "Canada": /^\d{3}-\d{3}-\d{4}$/,
  "France": /^\d{2}-\d{2}-\d{2}-\d{2}-\d{2}$/,
  "Netherlands": /^\(\d{3}\)-\d{3}-\d{4}$/,
};

// ---------- допоміжні функції ----------

function randomCourse() {
  return _.sample(COURSES);
}

function randomColor() {
  // випадкове число до 0xffffff, переведене в hex і доповнене нулями до 6 символів
  return "#" + _.padStart(_.random(0, 0xffffff).toString(16), 6, "0");
}

function capitalize(text) {
  return _.isString(text) ? _.upperFirst(text) : text;
}

function calculateAge(dateString) {
  const birth = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// координати з randomuser.me приходять рядками - перетворюємо їх на числа
function formatCoordinates(coordinates) {
  if (_.isNil(coordinates)) {
    return null;
  }
  return {
    latitude: parseFloat(coordinates.latitude),
    longitude: parseFloat(coordinates.longitude),
  };
}

// ---------- мапінг ----------

function formatRandomUser(user) {
  return {
    gender: capitalize(user.gender),
    title: _.get(user, "name.title"),
    full_name: _.get(user, "name.first") + " " + _.get(user, "name.last"),
    city: _.get(user, "location.city"),
    state: _.get(user, "location.state"),
    country: _.get(user, "location.country"),
    postcode: _.get(user, "location.postcode"),
    coordinates: formatCoordinates(_.get(user, "location.coordinates")),
    timezone: _.get(user, "location.timezone"),
    email: user.email,
    b_day: _.get(user, "dob.date"),
    age: _.get(user, "dob.age"),
    phone: user.phone,
    picture_large: _.get(user, "picture.large"),
    picture_thumbnail: _.get(user, "picture.thumbnail"),
    id: _.get(user, "login.uuid"),
    favorite: false,
    course: randomCourse(),
    bg_color: randomColor(),
    note: "No notes yet",
  };
}

// додаткові користувачі мають неповні поля та null замість значень
function fixAdditionalUser(user) {
  const result = _.assign({}, user);

  result.gender = capitalize(result.gender);
  result.id = String(result.id);
  result.favorite = result.favorite === true;
  result.bg_color = result.bg_color || randomColor();
  result.note = result.note || "No notes yet";
  result.course = result.course ? capitalize(result.course) : randomCourse();
  result.coordinates = formatCoordinates(result.coordinates);

  if (!_.isUndefined(result.postcode)) {
    result.postcode = _.toNumber(result.postcode);
  }
  if (result.b_day && _.isUndefined(result.age)) {
    result.age = calculateAge(result.b_day);
  }
  return result;
}

function formatUsers(randomUsers, extraUsers) {
  const result = _.map(randomUsers, formatRandomUser);

  // додаємо тільки тих, кого ще немає (повтори шукаємо за full_name)
  for (const user of extraUsers) {
    const duplicate = _.find(result, { full_name: user.full_name });
    if (_.isUndefined(duplicate)) {
      result.push(fixAdditionalUser(user));
    } else if (user.favorite === true) {
      duplicate.favorite = true;
    }
  }
  return result;
}

// ---------- валідація ----------

function startsWithCapital(value) {
  if (!_.isString(value) || _.isEmpty(value)) {
    return false;
  }
  const first = _.first(value);
  // перша літера має бути буквою; у письмах без регістру (перська) велика літера неможлива
  const isLetter = /\p{L}/u.test(first);
  return isLetter && first === _.toUpper(first);
}

function isValidPhone(phone, country) {
  if (!_.isString(phone)) {
    return false;
  }
  const format = _.get(PHONE_FORMATS, [country]);
  return _.isRegExp(format) && format.test(phone);
}

function isValidEmail(email) {
  return _.isString(email) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// повертає масив назв невалідних полів (порожній масив = обʼєкт валідний)
function validateUser(user) {
  const textFields = ["full_name", "gender", "note", "state", "city", "country"];

  // _.reject залишає тільки ті поля, які НЕ пройшли перевірку
  const errors = _.reject(textFields, function (field) {
    return startsWithCapital(user[field]);
  });

  if (!_.isNumber(user.age) || _.isNaN(user.age)) {
    errors.push("age");
  }
  if (!isValidPhone(user.phone, user.country)) {
    errors.push("phone");
  }
  if (!isValidEmail(user.email)) {
    errors.push("email");
  }
  return errors;
}

function isValidUser(user) {
  return _.isEmpty(validateUser(user));
}

// ---------- фільтрування ----------

// age: число (точний збіг) або обʼєкт { gt: 30, lt: 50 }
function matchesAge(userAge, condition) {
  if (_.isNumber(condition)) {
    return userAge === condition;
  }
  if (!_.isUndefined(condition.gt) && !(userAge > condition.gt)) {
    return false;
  }
  if (!_.isUndefined(condition.lt) && !(userAge < condition.lt)) {
    return false;
  }
  return true;
}

// filters: { country, age, gender, favorite } - усі умови повинні виконатись («і»)
function filterUsers(users, filters) {
  // поля, які порівнюються на точний збіг (без тих, що не задані)
  const exact = _.omitBy(_.pick(filters, ["country", "gender", "favorite"]), _.isUndefined);

  return _.filter(users, function (user) {
    if (!_.isMatch(user, exact)) {
      return false;
    }
    if (!_.isUndefined(filters.age) && !matchesAge(user.age, filters.age)) {
      return false;
    }
    // додатково для UI: чекбокс "Only with photo"
    if (filters.photo === true && !user.picture_large) {
      return false;
    }
    return true;
  });
}

// ---------- сортування ----------

function getSortValue(user, field) {
  const value = user[field];
  if (field === "b_day") {
    return new Date(value).getTime();
  }
  if (_.isString(value)) {
    // deburr прибирає діакритику (É -> E), щоб імена сортувались природно
    return _.deburr(value).toLowerCase();
  }
  return value;
}

// field: full_name, age, b_day, country; order: "asc" або "desc"
function sortUsers(users, field, order = "asc") {
  // перший ключ: користувачі без значення поля йдуть у кінець
  return _.orderBy(
    users,
    [
      function (user) { return _.isUndefined(user[field]); },
      function (user) { return getSortValue(user, field); },
    ],
    ["asc", order]
  );
}

// ---------- пошук ----------

// field: "full_name" (або "name"), "note", "age"
function findUser(users, field, value) {
  if (field === "name") {
    field = "full_name";
  }

  const found = _.find(users, function (user) {
    const userValue = user[field];
    if (_.isUndefined(userValue)) {
      return false;
    }
    if (_.isNumber(value)) {
      return userValue === value;
    }
    return _.includes(_.toLower(String(userValue)), _.toLower(value));
  });
  return _.isUndefined(found) ? null : found;
}

// ---------- відсоток ----------

function getPercentage(users, filters) {
  if (_.isEmpty(users)) {
    return 0;
  }
  const found = filterUsers(users, filters);
  return (found.length / users.length) * 100;
}

export {
  formatUsers, validateUser, isValidUser, filterUsers, sortUsers, findUser, getPercentage,
  startsWithCapital, isValidEmail, calculateAge,
};
