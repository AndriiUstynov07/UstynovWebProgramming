const RANDOM_USER_URL = "https://randomuser.me/api/";
const TEACHERS_URL = "http://localhost:3000/teachers";
const SEED = "teachinder";

// національності, для яких у lab2.js є формат телефону (потрібно для валідації)
const NATIONALITIES = "au,ca,de,dk,es,fi,fr,ie,ir,nl,no,nz,tr,us,ch";

// Завдання 1 і 4: запит списку користувачів (page потрібна для пагінації)
async function fetchRandomUsers(count, page) {
  const url = RANDOM_USER_URL + "?results=" + count + "&page=" + page +
    "&seed=" + SEED + "&nat=" + NATIONALITIES;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("randomuser.me responded with status " + response.status);
  }
  const data = await response.json();
  return data.results;
}

// Завдання 5: відправка нового викладача на json-server
async function saveTeacher(teacher) {
  const response = await fetch(TEACHERS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(teacher),
  });
  if (!response.ok) {
    throw new Error("json-server responded with status " + response.status);
  }
  return response.json();
}

export { fetchRandomUsers, saveTeacher };
