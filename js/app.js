//declaracion variables
const temp = document.getElementById("temp"),
  date = document.getElementById("date-time"),
  currenLocation = document.getElementById("location"),
  condition = document.getElementById("condition"),
  rain = document.getElementById("rain"),
  columna2Icon = document.getElementById("icon"),
  uvIndex = document.querySelector(".uv-index"),
  uvText = document.querySelector(".uv-text"),
  windSpeed = document.querySelector(".wind-speed"),
  sunRise = document.querySelector(".sun-rise"),
  sunSet = document.querySelector(".sun-set"),
  humidity = document.querySelector(".humidity"),
  visibility = document.querySelector(".visibility"),
  humidityStatus = document.querySelector(".humidity-status"),
  airQuality = document.querySelector(".air-quality"),
  airQualityStatus = document.querySelector(".air-quality-status"),
  visibilityStatus = document.querySelector(".visibility-status"),
  celciusBtn = document.querySelector('.celcius'),
  tempUnit = document.querySelectorAll('.temp-unit'),
  hourlyBtn = document.querySelector('.hourly'),
  weekBtn = document.querySelector('.week'),
  weatherCards = document.querySelector("#weather-cards"),
  searchForm = document.querySelector('#search'),
  search = document.querySelector('#query');
  

let currentCity = "Rosario";
let currentUnit = "c";
let hourlyorWeek = "week";


// funcion para actualizar dia y hora
const getDateTime = () => {
  let now = new Date(),
  hour = now.getHours(),
  minute = now.getMinutes();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  hour = hour % 24;
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }

  let daysString = days[now.getDay()];
  return `${daysString}, ${hour}:${minute}`;
};

date.innerText = getDateTime();

// actualizar time 
setInterval(() => {
  date.innerText = getDateTime();
}, 1000);


// funcion para obtener datos del clima
const getWeatherData = (city, unit, hourlyorWeek) => {
  
  const apiKey = "2F9GL8R9TAH2XYXCVB9AUZ9WU";
  fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`,
    {
      method: "GET",
      
    }
  )
    .then((response) => response.json())
    .then((data) => {
      let today = data.currentConditions;
      if (unit == "c") {
        temp.innerText = today.temp;
      } else {
        temp.innerText = celciusTemp(today.temp);
      }
      currenLocation.innerText = data.resolvedAddress;
      condition.innerText = today.conditions;
      rain.innerText = "Perc - " + today.precip + "%";
      uvIndex.innerText = today.uvindex;
      windSpeed.innerText = today.windspeed; 
      columna2Icon.src = getIcon(today.icon); 
      humidity.innerText = today.humidity + "%";
      visibility.innerText = today.visibility;
      airQuality.innerText = today.winddir;
      sunRise.innerText = convertTimeTo12HourFormat(today.sunrise);
      sunSet.innerText = convertTimeTo12HourFormat(today.sunset);
      getUvIndexStatus(today.uvindex);
      updateHumidityStatus(today.humidity);
      updateVisibilityStatus(today.visibility);
      updateAirQualityStatus(today.winddir);
      hourlyorWeek == "hourly"
      ? updateForeCast(data.days[0].hours, unit, "day")
      : updateForeCast(data.days, unit, "week");
    })
    .catch((err) =>{
      alert('City not found')
    })
};



//llamar funcion getWeatherData
getWeatherData(currentCity, hourlyorWeek);


const celciusTemp = (temp) => {
  return temp;

};

const getUvIndexStatus = (uvIndex) => {
  if (uvIndex <= 2) {
    uvText.innerText = "Low";
  } else if (uvIndex <= 5) {
    uvText.innerText = "Moderate";
  } else if (uvIndex <= 7) {
    uvText.innerText = "High";
  } else if (uvIndex <= 10) {
    uvText.innerText = "Very High";
  } else {
    uvText.innerText = "Extreme";
  }
};

// funcion actualizar humedad
const updateHumidityStatus = (humidity) => {
  if (humidity <= 30) {
    humidityStatus.innerText = "Low";
  } else if (humidity <= 60) {
    humidityStatus.innerText = "Moderate";
  } else {
    humidityStatus.innerText = "High";
  }
};

// funcion actualizar visibilidad
const updateVisibilityStatus = (visibility) => {
  if (visibility <= 0.3) {
    visibilityStatus.innerText = "Dense Fog";
  } else if (visibility <= 0.16) {
    visibilityStatus.innerText = "Moderate Fog";
  } else if (visibility <= 0.35) {
    visibilityStatus.innerText = "Light Fog";
  } else if (visibility <= 1.13) {
    visibilityStatus.innerText = "Very Light Fog";
  } else if (visibility <= 2.16) {
    visibilityStatus.innerText = "Light Mist ";
  } else if (visibility <= 5.4) {
    visibilityStatus.innerText = "Very Light Fog";
  } else if (visibility <= 10.8) {
    visibilityStatus.innerText = "Clear Air";
  } else {
    visibilityStatus.innerText = "Very Clear Air";
  }
};

//funcion actualizar calidad del aire
const updateAirQualityStatus = (airQuality) => {
  if (airQuality <= 50) {
    airQualityStatus.innerText = "Good";
  } else if (airQuality <= 100) {
    airQualityStatus.innerText = "Moderate";
  } else if (airQuality <= 150) {
    airQualityStatus.innerText = "Unhealthy for Sensitive Groups";
  } else if (airQuality <= 200) {
    airQualityStatus.innerText = "Unhealthy";
  } else if (airQuality <= 250) {
    airQualityStatus.innerText = "Very Unhealthy";
  } else {
    airQualityStatus.innerText = "Hazardous";
  }
};

// funcion salida y entrada del sol
const convertTimeTo12HourFormat = (time) => {
  let hour = time.split(":")[0];
  let minute = time.split(":")[1];
  let ampm = hour >= 12 ? "pm" : "am"; // operador ternario
  hour = hour % 12;
  hour = hour ? hour : 12; // la hora 0 debe ser 12
  hour = hour < 10 ? "0" + hour : hour;
  minute = minute < 10 ? "0" + minute : minute;
  let strTime = hour + ":" + minute + " " + ampm;
  return strTime;
};

// funcion para icono
const getIcon = (condition) => {
  if (condition == "partly-cloudy-day") {
    return "icons/sun/27.png";
  } else if (condition == "partly-cloudy-night") {
    return "icons/moon/15.png";
  } else if (condition == "rain") {
    return "icons/rain/39.png";
  } else if (condition == "clear-day") {
    return "icons/sun/26.png";
  } else if (condition == "clear-night") {
    return "icons/moon/10.png";
  } else {
    return "icons/sun/26.png";
  }

  //funcion obtener dia
};
const getDayName = (date) => {
  let day = new Date(date);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day.getDay()];
};

// funcion convertir hora min seg
const getHour = (time) => {
  let hour = time.split(":")[0]
  let min = time.split(":")[1];
  hour = parseInt(hour);
  min = parseInt(min);

  if (hour > 12) {
    hour = hour - 12;
    return `${hour}:${min} PM`;
  } else {
    return `${hour}:${min} AM`;
  }
};

// funcion actualizar pronostico dia y semana
const updateForeCast = (data, type, unit) => {
  weatherCards.innerHTML = "";

  let day = 0;
  let numCards = 0;
  if (type == "day") {
    numCards = 24;
  } else {
    numCards = 7;
  }

  for (let i = 0; i < numCards; i++) {
    let card = document.createElement("div");
    card.classList.add("card");
    let dayName = getHour(data[day].datetime);
    //let dayName = 
    if (type == "week") {
      dayName = getDayName(data[day].datetime);
    }


    let dayTemp = data[day].temp;
    if (unit == 'c') {
      dayTemp = celciusTemp(data[day].temp);
    }
   
    let iconCondition = data[day].icon;
    let iconSrc = getIcon(iconCondition);
    let tempUnit = "°C";
    if (unit == 'c') {
      tempUnit = '°C'
    }

    card.innerHTML = `
 
  <h2 class="day-name">${dayName}</h2>
  <div class="card-icon">
    <img src="${iconSrc}" alt="" />
  </div>
  <div class="day-temp">
    <h2 class="temp">${dayTemp}</h2>
    <span class="temp-unit">${tempUnit}</span>
  </div>
  `;
    weatherCards.appendChild(card);
    day++;
  }
};

//

celciusBtn.addEventListener('click', ()=>{
changeUnit('c')
});


hourlyBtn.addEventListener('click', () =>{
  changeTimeSpan('hourly')
})

weekBtn.addEventListener('click', () =>{
  changeTimeSpan('week')
});


const changeTimeSpan = (unit) =>{
  if (hourlyorWeek !== unit) {
    hourlyorWeek = unit;
    if (unit === "hourly") {
      hourlyBtn.classList.add("active");
      weekBtn.classList.remove("active");
    } else {
      hourlyBtn.classList.remove("active");
      weekBtn.classList.add("active");
    }
   
  }
  getWeatherData(currentCity, hourlyorWeek,unit);

}

// funcion para buscar clima otra ciudad
searchForm.addEventListener('submit', (e) =>{
e.preventDefault()
let city = search.value.trim();
if (city) {
  currentCity = city;
  getWeatherData(currentCity,hourlyorWeek)
}
});

