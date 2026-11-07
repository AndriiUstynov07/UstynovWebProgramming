import { setCookie, getCookie, deleteCookie } from './cookies.js'

// Логін і пароль: "Ім'я + номер курсу" (Andrii, 3 курс)
const CORRECT_LOGIN = 'andrii3'
const CORRECT_PASSWORD = 'andrii3'

// Повертає true, якщо дані правильні, і зберігає вхід у cookies
export function login(login, password, remember) {
  if (login === CORRECT_LOGIN && password === CORRECT_PASSWORD) {
    // "Запам'ятати мене" - 7 днів, інакше cookie зникне після закриття браузера
    const days = remember ? 7 : 0
    setCookie('isLoggedIn', 'true', days)
    setCookie('userName', login, days)
    return true
  }
  return false
}

export function isLoggedIn() {
  return getCookie('isLoggedIn') === 'true'
}

export function getUserName() {
  return getCookie('userName')
}

export function logout() {
  deleteCookie('isLoggedIn')
  deleteCookie('userName')
}
