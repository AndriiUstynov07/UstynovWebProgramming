// Один компонент для всіх днів, значення приходять через props
function WeatherCard(props) {
  const date = new Date(props.date)
  const dayName = date.toLocaleDateString('uk-UA', { weekday: 'long' })
  const dayDate = date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })

  return (
    <div className="weather-card">
      <h3>{props.isToday ? 'Сьогодні' : dayName}</h3>
      <p className="weather-date">{dayDate}</p>
      <div className="weather-icon">{props.icon}</div>
      <p className="weather-text">{props.text}</p>
      <p>Макс: <b>{props.maxTemp}°C</b></p>
      <p>Мін: <b>{props.minTemp}°C</b></p>
      <p>Вітер: {props.wind} км/год</p>
      <p>Ймовірність опадів: {props.rain}%</p>
    </div>
  )
}

export default WeatherCard
