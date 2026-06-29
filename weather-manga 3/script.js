// =====================================================
// 天気漫画 - script.js
// 気象庁の防災情報API(認証不要・CORS許可)を利用しています。
// 参考: https://www.jma.go.jp/bosai/forecast/
//
// シナリオの管理方式:
// 「気温(℃)_天気(英語)」をキーにして1つの漫画を対応させます。
// 例: 23度・曇り → "23_cloudy" → images/23_cloudy.jpg
// 天気は sunny / cloudy / rainy の3種類です。
// =====================================================

const AREAS = [
  { code: "130000", name: "東京都" },
  { code: "270000", name: "大阪府" },
  { code: "230000", name: "愛知県(名古屋)" },
  { code: "400000", name: "福岡県" },
  { code: "016000", name: "北海道(石狩・札幌)" },
  { code: "471000", name: "沖縄県(沖縄本島)" }
];

const areaSelect = document.getElementById("area-select");
const resultSection = document.getElementById("result");
const errorSection = document.getElementById("error-message");
const weatherIcon = document.getElementById("weather-icon");
const tempDisplay = document.getElementById("temp-display");
const weatherText = document.getElementById("weather-text");
const mangaImage = document.getElementById("manga-image");
const mangaTitle = document.getElementById("manga-title");

let scenarios = null;

init();

async function init() {
  AREAS.forEach(area => {
    const opt = document.createElement("option");
    opt.value = area.code;
    opt.textContent = area.name;
    areaSelect.appendChild(opt);
  });

  scenarios = await fetch("data/scenarios.json").then(r => r.json());

  const savedArea = localStorage.getItem("selectedArea");
  if (savedArea) {
    areaSelect.value = savedArea;
    loadWeather(savedArea);
  }

  areaSelect.addEventListener("change", () => {
    const code = areaSelect.value;
    if (!code) return;
    localStorage.setItem("selectedArea", code);
    loadWeather(code);
  });
}

async function loadWeather(areaCode) {
  showLoading();
  try {
    const url = `https://www.jma.go.jp/bosai/forecast/data/forecast/${areaCode}.json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("API取得失敗");
    const data = await res.json();

    const { weatherCategory, weatherLabel } = extractWeather(data);
    const temp = extractTemperature(data);

    displayResult(weatherCategory, weatherLabel, temp);
  } catch (err) {
    console.error(err);
    showError();
  }
}

// ---- 天気予報テキストから「sunny/cloudy/rainy」を判定 ----
function extractWeather(data) {
  const series = data[0].timeSeries[0];
  const areaData = series.areas[0];
  const weatherStr = areaData.weathers[0];

  let category = "cloudy";
  if (weatherStr.includes("雨") || weatherStr.includes("雷")) {
    category = "rainy";
  } else if (weatherStr.includes("晴")) {
    category = "sunny";
  } else if (weatherStr.includes("曇")) {
    category = "cloudy";
  }

  return { weatherCategory: category, weatherLabel: weatherStr };
}

// ---- 気温の取得(1℃刻みでそのまま使用) ----
function extractTemperature(data) {
  try {
    const tempSeries = data[0].timeSeries.find(s => s.areas[0].temps);
    const temps = tempSeries.areas[0].temps;
    const validTemp = temps.find(t => t !== "" && !isNaN(parseInt(t)));
    return validTemp ? parseInt(validTemp) : null;
  } catch (e) {
    console.warn("気温の取得に失敗しました。", e);
    return null;
  }
}

function displayResult(category, label, temp) {
  errorSection.classList.add("hidden");
  resultSection.classList.remove("hidden");

  const icons = { sunny: "☀️", cloudy: "☁️", rainy: "☔" };
  weatherIcon.textContent = icons[category] || "❓";
  tempDisplay.textContent = temp !== null ? `${temp}℃` : "--℃";
  weatherText.textContent = label;

  const key = `${temp}_${category}`;
  const scenario = scenarios[key];

  if (scenario) {
    mangaImage.src = scenario.image;
    mangaImage.alt = scenario.title;
    mangaTitle.textContent = scenario.title;
  } else {
    mangaImage.src = "images/placeholder.png";
    mangaImage.alt = "未対応";
    mangaTitle.textContent = `${key} のお話はまだ準備中です`;
  }
}

function showLoading() {
  resultSection.classList.remove("hidden");
  errorSection.classList.add("hidden");
  mangaTitle.textContent = "読み込み中...";
}

function showError() {
  resultSection.classList.add("hidden");
  errorSection.classList.remove("hidden");
}
