// Прості функції для роботи з cookies

export function setCookie(name, value, days) {
  let cookie = name + '=' + encodeURIComponent(value) + '; path=/'

  // якщо days не передали - cookie живе до закриття браузера
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    cookie += '; expires=' + date.toUTCString()
  }

  document.cookie = cookie
}

export function getCookie(name) {
  const parts = document.cookie.split('; ')
  for (let i = 0; i < parts.length; i++) {
    const pair = parts[i].split('=')
    if (pair[0] === name) {
      return decodeURIComponent(pair[1])
    }
  }
  return null
}

export function deleteCookie(name) {
  document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
}
