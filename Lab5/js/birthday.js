// Завдання 4: скільки днів залишилось до наступного дня народження (бібліотека day.js, глобальна змінна dayjs)

// дата народження береться як "РРРР-ММ-ДД" (перші 10 символів), як і в таблиці
function parseBirthDate(bDay) {
  return dayjs(String(bDay).slice(0, 10));
}

// повертає кількість днів до наступного дня народження (0 - сьогодні) або null, якщо дати немає
function getDaysToBirthday(bDay) {
  if (!bDay) {
    return null;
  }
  const birth = parseBirthDate(bDay);
  if (!birth.isValid()) {
    return null;
  }

  const today = dayjs().startOf("day");

  // день народження в цьому році; якщо він уже минув - беремо наступний рік
  let next = birth.year(today.year());
  if (next.isBefore(today)) {
    next = next.add(1, "year");
  }
  return next.diff(today, "day");
}

function getBirthdayText(bDay) {
  const days = getDaysToBirthday(bDay);
  if (days === null) {
    return "";
  }

  const date = parseBirthDate(bDay).format("D MMMM");
  if (days === 0) {
    return "Birthday: " + date + " - today!";
  }
  return "Birthday: " + date + " (in " + days + (days === 1 ? " day)" : " days)");
}

export { getDaysToBirthday, getBirthdayText };
