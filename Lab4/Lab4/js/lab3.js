import { startsWithCapital, isValidEmail, calculateAge } from "./lab2.js";

const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;

// Завдання 4: пошук за name, note або age
// (збіг за іменем або коментарем - часткове, без урахування регістру; вік - точний)
function searchUsers(users, text) {
  const query = text.trim().toLowerCase();
  if (query === "") {
    return users;
  }

  const result = [];
  for (const user of users) {
    const inName = user.full_name.toLowerCase().includes(query);
    const inNote = String(user.note).toLowerCase().includes(query);
    const sameAge = user.age !== undefined && String(user.age) === query;

    if (inName || inNote || sameAge) {
      result.push(user);
    }
  }
  return result;
}

// Завдання 5: перевірка полів форми; повертає масив повідомлень про помилки
function validateTeacherForm(data) {
  const errors = [];

  if (!startsWithCapital(data.full_name)) {
    errors.push("Name must start with a capital letter.");
  }
  if (data.city.trim() === "") {
    errors.push("City is required.");
  }
  if (!isValidEmail(data.email)) {
    errors.push("Email is not valid.");
  }
  if (!PHONE_PATTERN.test(data.phone)) {
    errors.push("Phone is not valid (7-20 digits, spaces, +, - or brackets).");
  }
  if (data.b_day === "") {
    errors.push("Date of birth is required.");
  } else if (calculateAge(data.b_day) < 18) {
    errors.push("Teacher must be at least 18 years old.");
  }
  if (data.note !== "" && !startsWithCapital(data.note)) {
    errors.push("Notes must start with a capital letter.");
  }
  return errors;
}

// Завдання 5: обʼєкт викладача у тому ж форматі, що й у лабораторній №2
function createTeacher(data) {
  return {
    id: crypto.randomUUID(),
    gender: data.gender,
    full_name: data.full_name.trim(),
    course: data.course,
    city: data.city.trim(),
    country: data.country,
    email: data.email.trim(),
    phone: data.phone.trim(),
    b_day: data.b_day,
    age: calculateAge(data.b_day),
    bg_color: data.bg_color,
    note: data.note === "" ? "No notes yet" : data.note.trim(),
    favorite: false,
  };
}

export { searchUsers, validateTeacherForm, createTeacher };
