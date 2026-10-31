// Завдання 1: карта з розташуванням викладача (бібліотека Leaflet, глобальна змінна L)

let map = null;
let marker = null;
let position = null; // { latlng: [широта, довгота], title: "місто, країна" }

// карту малюємо тільки коли користувач відкрив <details>,
// бо в закритому блоці Leaflet не знає розмірів контейнера
function onMapToggle(event) {
  if (!event.target.open || position === null || typeof L === "undefined") {
    return;
  }

  if (map === null) {
    map = L.map("map");
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
    marker = L.marker(position.latlng).addTo(map);
  }

  map.invalidateSize();
  map.setView(position.latlng, 5);
  marker.setLatLng(position.latlng);
  marker.bindPopup(position.title);
}

function initMap() {
  document.getElementById("map-box").addEventListener("toggle", onMapToggle);
}

// викликається, коли відкривається картка викладача
function showMap(user) {
  const box = document.getElementById("map-box");
  const coordinates = user.coordinates;

  box.open = false;

  // викладачі, додані через форму, не мають координат - ховаємо карту
  const latitude = coordinates ? parseFloat(coordinates.latitude) : NaN;
  const longitude = coordinates ? parseFloat(coordinates.longitude) : NaN;
  if (!_.isFinite(latitude) || !_.isFinite(longitude)) {
    position = null;
    box.hidden = true;
    return;
  }

  position = {
    latlng: [latitude, longitude],
    title: user.city + ", " + user.country,
  };
  box.hidden = false;
}

export { initMap, showMap };
