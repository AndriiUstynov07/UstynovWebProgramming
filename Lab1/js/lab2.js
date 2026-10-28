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
    const index = Math.floor(Math.random() * COURSES.length);
    return COURSES[index];
  }
  
  function randomColor() {
    let color = "#";
    const symbols = "0123456789abcdef";
    for (let i = 0; i < 6; i++) {
      color += symbols[Math.floor(Math.random() * symbols.length)];
    }
    return color;
  }
  
  function capitalize(text) {
    if (typeof text !== "string" || text === "") {
      return text;
    }
    return text[0].toUpperCase() + text.slice(1);
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
  
  // ---------- Завдання 1 ----------
  
  function formatRandomUser(user) {
    return {
      gender: capitalize(user.gender),
      title: user.name.title,
      full_name: user.name.first + " " + user.name.last,
      city: user.location.city,
      state: user.location.state,
      country: user.location.country,
      postcode: user.location.postcode,
      coordinates: user.location.coordinates,
      timezone: user.location.timezone,
      email: user.email,
      b_day: user.dob.date,
      age: user.dob.age,
      phone: user.phone,
      picture_large: user.picture.large,
      picture_thumbnail: user.picture.thumbnail,
      id: user.login.uuid,
      favorite: false,
      course: randomCourse(),
      bg_color: randomColor(),
      note: "No notes yet",
    };
  }
  
  // додаткові користувачі мають неповні поля та null замість значень
  function fixAdditionalUser(user) {
    const result = Object.assign({}, user);
  
    result.gender = capitalize(result.gender);
    result.id = String(result.id);
    result.favorite = result.favorite === true;
    result.bg_color = result.bg_color ? result.bg_color : randomColor();
    result.note = result.note ? result.note : "No notes yet";
    result.course = result.course ? capitalize(result.course) : randomCourse();
  
    if (result.postcode !== undefined) {
      result.postcode = Number(result.postcode);
    }
    if (result.b_day && result.age === undefined) {
      result.age = calculateAge(result.b_day);
    }
    return result;
  }
  
  function formatUsers(randomUsers, extraUsers) {
    const result = [];
  
    for (const user of randomUsers) {
      result.push(formatRandomUser(user));
    }
  
    // додаємо тільки тих, кого ще немає (повтори шукаємо за full_name)
    for (const user of extraUsers) {
      let exists = false;
      let duplicate = null;
      for (const added of result) {
        if (added.full_name === user.full_name) {
          exists = true;
          duplicate = added;
          break;
        }
      }
      if (!exists) {
        result.push(fixAdditionalUser(user));
      } else if (user.favorite === true) {
        duplicate.favorite = true;
      }
    }
    return result;
  }
  
  // ---------- Завдання 2 ----------
  
  function startsWithCapital(value) {
    if (typeof value !== "string" || value === "") {
      return false;
    }
    const first = value[0];
    // перша літера має бути буквою; у письмах без регістру (перська) велика літера неможлива
    const isLetter = /\p{L}/u.test(first);
    return isLetter && first === first.toUpperCase();
  }
  
  function isValidPhone(phone, country) {
    if (typeof phone !== "string") {
      return false;
    }
    const format = PHONE_FORMATS[country];
    if (format === undefined) {
      return false;
    }
    return format.test(phone);
  }
  
  function isValidEmail(email) {
    return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  // повертає масив назв невалідних полів (порожній масив = обʼєкт валідний)
  function validateUser(user) {
    const errors = [];
    const textFields = ["full_name", "gender", "note", "state", "city", "country"];
  
    for (const field of textFields) {
      if (!startsWithCapital(user[field])) {
        errors.push(field);
      }
    }
    if (typeof user.age !== "number" || Number.isNaN(user.age)) {
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
    return validateUser(user).length === 0;
  }
  
  // ---------- Завдання 3 ----------
  
  // age: число (точний збіг) або обʼєкт { gt: 30, lt: 50 }
  function matchesAge(userAge, condition) {
    if (typeof condition === "number") {
      return userAge === condition;
    }
    if (condition.gt !== undefined && !(userAge > condition.gt)) {
      return false;
    }
    if (condition.lt !== undefined && !(userAge < condition.lt)) {
      return false;
    }
    return true;
  }
  
  // filters: { country, age, gender, favorite } - усі умови повинні виконатись («і»)
  function filterUsers(users, filters) {
    const result = [];
  
    for (const user of users) {
      let ok = true;
  
      if (filters.country !== undefined && user.country !== filters.country) {
        ok = false;
      }
      if (filters.gender !== undefined && user.gender !== filters.gender) {
        ok = false;
      }
      if (filters.favorite !== undefined && user.favorite !== filters.favorite) {
        ok = false;
      }
      if (filters.age !== undefined && !matchesAge(user.age, filters.age)) {
        ok = false;
      }
      // додатково для UI: чекбокс "Only with photo"
      if (filters.photo === true && !user.picture_large) {
        ok = false;
      }
  
      if (ok) {
        result.push(user);
      }
    }
    return result;
  }
  
  // ---------- Завдання 4 ----------
  
  // field: full_name, age, b_day, country; order: "asc" або "desc"
  function sortUsers(users, field, order = "asc") {
    const copy = users.slice();
  
    copy.sort(function (a, b) {
      let valueA = a[field];
      let valueB = b[field];
      let result = 0;
  
      // користувачі без значення поля йдуть у кінець
      if (valueA === undefined) return 1;
      if (valueB === undefined) return -1;
  
      if (field === "b_day") {
        result = new Date(valueA) - new Date(valueB);
      } else if (typeof valueA === "number") {
        result = valueA - valueB;
      } else {
        result = valueA.localeCompare(valueB);
      }
  
      return order === "desc" ? -result : result;
    });
    return copy;
  }
  
  // ---------- Завдання 5 ----------
  
  // field: "full_name" (або "name"), "note", "age"
  function findUser(users, field, value) {
    if (field === "name") {
      field = "full_name";
    }
  
    for (const user of users) {
      const userValue = user[field];
      if (userValue === undefined) {
        continue;
      }
      if (typeof value === "number") {
        if (userValue === value) {
          return user;
        }
      } else if (String(userValue).toLowerCase().includes(value.toLowerCase())) {
        return user;
      }
    }
    return null;
  }
  
  // ---------- Завдання 6 ----------
  
  function getPercentage(users, filters) {
    if (users.length === 0) {
      return 0;
    }
    const found = filterUsers(users, filters);
    return (found.length / users.length) * 100;
  }
  
  export { formatUsers, validateUser, isValidUser, filterUsers, sortUsers, findUser, getPercentage };