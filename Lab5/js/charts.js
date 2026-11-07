// Завдання 2: кругові діаграми (бібліотека Chart.js, глобальна змінна Chart) замість таблиці статистики

const charts = {};

const AGE_GROUPS = [
  { label: "18-31", from: 18, to: 31 },
  { label: "32-45", from: 32, to: 45 },
  { label: "46-60", from: 46, to: 60 },
  { label: "61+", from: 61, to: 200 },
];

function getAgeGroup(user) {
  const group = _.find(AGE_GROUPS, function (item) {
    return user.age >= item.from && user.age <= item.to;
  });
  return group ? group.label : "Unknown";
}

// кількість викладачів по кожному значенню; від більшого до меншого
function countSorted(users, getKey) {
  const counts = _.countBy(users, getKey);
  return _.orderBy(_.toPairs(counts), [1, 0], ["desc", "asc"]);
}

// вікові групи показуємо у фіксованому порядку
function countAgeGroups(users) {
  const counts = _.countBy(users, getAgeGroup);
  const pairs = [];
  for (const group of AGE_GROUPS) {
    if (counts[group.label]) {
      pairs.push([group.label, counts[group.label]]);
    }
  }
  if (counts.Unknown) {
    pairs.push(["Unknown", counts.Unknown]);
  }
  return pairs;
}

function getColors(count) {
  // кут 137.5 дає помітно різні відтінки навіть для багатьох секторів
  return _.times(count, function (i) {
    return "hsl(" + Math.round((i * 137.5) % 360) + ", 65%, 60%)";
  });
}

function drawPie(canvasId, title, pairs) {
  if (typeof Chart === "undefined") {
    return;
  }

  const labels = _.map(pairs, 0);
  const values = _.map(pairs, 1);
  const total = _.sum(values);
  const colors = getColors(labels.length);

  let chart = charts[canvasId];
  if (chart) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = values;
    chart.data.datasets[0].backgroundColor = colors;
    chart.update();
    return;
  }

  charts[canvasId] = new Chart(document.getElementById(canvasId), {
    type: "pie",
    data: {
      labels: labels,
      datasets: [{ data: values, backgroundColor: colors }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: title, font: { size: 18 } },
        legend: { position: "right", labels: { boxWidth: 14 } },
        tooltip: {
          callbacks: {
            label: function (item) {
              const sum = _.sum(item.dataset.data);
              const percent = sum === 0 ? 0 : (item.parsed / sum) * 100;
              return item.label + ": " + item.parsed + " (" + percent.toFixed(1) + "%)";
            },
          },
        },
      },
    },
  });
}

// малює (або оновлює) усі діаграми за списком викладачів
function updateCharts(users) {
  drawPie("chart-course", "By speciality", countSorted(users, "course"));
  drawPie("chart-gender", "By gender", countSorted(users, "gender"));
  drawPie("chart-country", "By country", countSorted(users, "country"));
  drawPie("chart-age", "By age group", countAgeGroups(users));
}

export { updateCharts };
