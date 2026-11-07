import { startsWithCapital, isValidEmail, calculateAge } from "./lab2.js";

// Завдання 3 (Lab 5): пошук і валідація форми переписані з lodash (`_` - глобальна змінна)

const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;

// пошук за name, note або age
// (збіг за іменем або коментарем - часткове, без урахування регістру; вік - точний)
function searchUsers(users, text) {
  const query = _.toLower(_.trim(text));
  if (query === "") {
    return users;
  }

  return _.filter(users, function (user) {
    const inName = _.includes(_.toLower(user.full_name), query);
    const inNote = _.includes(_.toLower(String(user.note)), query);
    const sameAge = !_.isUndefined(user.age) && String(user.age) === query;
    return inName || inNote || sameAge;
  });
}

// перевірка полів форми; повертає масив повідомлень про помилки
function validateTeacherForm(data) {
  const errors = [];

  if (!startsWithCapital(data.full_name)) {
    errors.push("Name must start with a capital letter.");
  }
  if (_.isEmpty(_.trim(data.city))) {
    errors.push("City is required.");
  }
  if (!isValidEmail(data.email)) {
    errors.push("Email is not valid.");
  }
  if (!PHONE_PATTERN.test(data.phone)) {
    errors.push("Phone is not valid (7-20 digits, spaces, +, - or brackets).");
  }
  if (_.isEmpty(data.b_day)) {
    errors.push("Date of birth is required.");
  } else if (calculateAge(data.b_day) < 18) {
    errors.push("Teacher must be at least 18 years old.");
  }
  if (!_.isEmpty(data.note) && !startsWithCapital(data.note)) {
    errors.push("Notes must start with a capital letter.");
  }
  return errors;
}

// обʼєкт викладача у тому ж форматі, що й у лабораторній №2
function createTeacher(data) {
  return {
    id: crypto.randomUUID(),
    gender: data.gender,
    full_name: _.trim(data.full_name),
    course: data.course,
    city: _.trim(data.city),
    country: data.country,
    email: _.trim(data.email),
    phone: _.trim(data.phone),
    b_day: data.b_day,
    age: calculateAge(data.b_day),
    bg_color: data.bg_color,
    note: _.isEmpty(data.note) ? "No notes yet" : _.trim(data.note),
    favorite: false,
  };
}

export { searchUsers, validateTeacherForm, createTeacher };
