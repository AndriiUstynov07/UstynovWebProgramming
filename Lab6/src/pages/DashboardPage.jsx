import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import WeatherCard from '../components/WeatherCard.jsx'
import Loader from '../components/Loader.jsx'
import { loadWeather, KYIV } from '../utils/weatherApi.js'
import { logout, getUserName } from '../utils/auth.js'

function DashboardPage() {
  const [days, setDays] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [place, setPlace] = useState('Київ')
  const [attempt, setAttempt] = useState(0) // для кнопки "Спробувати ще раз"
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    setError('')

    // Завантажує погоду для заданих координат
    function getWeather(latitude, longitude, placeName) {
      loadWeather(latitude, longitude)
        .then((result) => {
          setDays(result)
          setPlace(placeName)
          setLoading(false)
        })
        .catch((err) => {
          setError('Не вдалося завантажити погоду. ' + err.message)
          setLoading(false)
        })
    }

    // Пробуємо взяти геолокацію користувача
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getWeather(position.coords.latitude, position.coords.longitude, 'Ваше місцезнаходження')
        },
        () => {
          // Користувач заборонив доступ - беремо Київ
          getWeather(KYIV.latitude, KYIV.longitude, 'Київ')
        }
      )
    } else {
      getWeather(KYIV.latitude, KYIV.longitude, 'Київ')
    }
  }, [attempt])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="dashboard">
      <header className="header">
        <span>Привіт, {getUserName()}!</span>
        <button onClick={handleLogout}>Вийти</button>
      </header>

      <h1>Погода: {place}</h1>

      {loading && <Loader />}

      {error && (
        <div>
          <p className="error">{error}</p>
          <button onClick={() => setAttempt(attempt + 1)}>Спробувати ще раз</button>
        </div>
      )}

      {!loading && !error && (
        <div className="weather-list">
          {days.map((day, index) => (
            <WeatherCard
              key={day.date}
              date={day.date}
              isToday={index === 0}
              icon={day.icon}
              text={day.text}
              maxTemp={day.maxTemp}
              minTemp={day.minTemp}
              wind={day.wind}
              rain={day.rain}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default DashboardPage
