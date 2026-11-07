import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { login, isLoggedIn } from '../utils/auth.js'

function LoginPage() {
  const [loginValue, setLoginValue] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Якщо вже увійшли - одразу на dashboard
  if (isLoggedIn()) {
    return <Navigate to="/dashboard" replace />
  }

  function handleSubmit(event) {
    event.preventDefault() // щоб сторінка не перезавантажувалась

    // Перевірка форми
    if (loginValue.trim() === '') {
      setError('Введіть логін')
      return
    }
    if (password === '') {
      setError('Введіть пароль')
      return
    }

    const ok = login(loginValue.trim(), password, remember)

    if (ok) {
      setError('')
      navigate('/dashboard')
    } else {
      setError('Невірний логін або пароль')
    }
  }

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Вхід у Web App</h2>

        <label htmlFor="login">Логін:</label>
        <input
          id="login"
          type="text"
          placeholder="Введіть логін"
          value={loginValue}
          onChange={(e) => setLoginValue(e.target.value)}
        />

        <label htmlFor="password">Пароль:</label>
        <input
          id="password"
          type="password"
          placeholder="Введіть пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label className="remember">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Запам'ятати мене
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit">Увійти</button>
      </form>
    </div>
  )
}

export default LoginPage