const link =
  "http://api.weatherstack.com/current?access_key=08f5477478c6d26af4e0a91f973cd62a";

const root = document.getElementById("root")
const popup = document.getElementById("popup");
const textInput = document.getElementById("text-input");
const form = document.getElementById("form");
const closeBtn = document.querySelector("#close");

let store = {
  city: "Saint-Petersburg",
  temperature: 0,
  observationTime: "00:00 AM",
  isDay: "yes",
  description: "",
  properties: {
    cloudcover: {},
    humidity: {},
    windSpeed: {},
    pressure: {},
    uvIndex: {},
    visibility: {},
  }
}

const fetchData = async () => {
  try {
    const query = localStorage.getItem("query") || store.city;
    const result = await fetch(`${link}&query=${query}`);
    const data = await result.json();

    const {
      current: {
        cloudcover,
        temperature,
        humidity,
        observation_time: observationTime,
        pressure,
        uv_index: uvIndex,
        visibility,
        is_day: isDay,
        weather_descriptions: description,
        wind_speed: windSpeed,
      },
      location: {
        name,
      },
    } = data;


    store = {
      ...store,
      temperature,
      city: name,
      humidity,
      observationTime,
      isDay,
      description: description[0],
      properties: {
        cloudcover: {
          title: "Cloudcover",
          value: `${cloudcover}%`,
          icon: "cloud.png",
        },
        humidity: {
          title: "Humidity",
          value: `${humidity}%`,
          icon: "humidity.png",
        },
        windSpeed: {
          title: "Wind speed",
          value: `${windSpeed} km/h`,
          icon: "wind.png",
        },
        pressure: {
          title: "Pressure",
          value: `${pressure}%`,
          icon: "gauge.png",
        },
        uvIndex: {
          title: "UV index",
          value: `${uvIndex} / 100`,
          icon: "uv-index.png",
        },
        visibility: {
          title: "Visibility",
          value: `${visibility}%`,
          icon: "visibility.png",
        },
      }
    }
    console.log(data);
    renderComponent();

  } catch (err) {
    console.log(err);
  }
};

const getImage = (description) => {
  const value = description.toLowerCase()

  switch (value) {
    case "sunny":
      return `sunny.png`;
    case "partly":
      return `partly.png`;
    case "cloud":
      return `cloud.png`;
    case "fog":
      return `fog.png`;
    case "overcast":
      return `overcast.png`;
    case "partly cloudy":
      return `partly.png`;
    default:
      return `the.png`
  }
};

const RenderProperty = (properties) => {

  return Object.values(properties)
    .map(({ title, value, icon }) => {
      return `<div class="property">
  <div class="property-icon">
    <img src="./img/icons/${icon}" alt="">
  </div>
  <div class="property-info">
    <div class="propert-info__value">${value}</div>
    <div class="property-info__description">${title}</div>
  </div>
</div>`
    }).join("");
};


const markup = () => {
  const { city, description, observationTime, temperature, isDay, properties } = store;

  const containerClass = isDay === "yes" ? "is-day" : "";

  return `<div class="container ${containerClass}">
              <div class="top">
                <div class="city">
                  <div class="city-subtitle">Weather Today in</div>
                  <div class="city-title" id="city">
                    <span>${city}</span>
                  </div>
                </div>
                <div class="city-info">
                  <div class="top-left">
                    <img class="icon" src="./img/${getImage(description)}" alt="">
                    <div class="description">${description}</div>
                  </div>

                  <div class="top-right">
                    <div class="city-info__subtitle">as of ${observationTime}</div>
                    <div class="city-info__title">${temperature}°</div>
                  </div>
                </div>
              </div>
              <div id="properties">${RenderProperty(properties)}</div>
            </div>`;
};
const togglePopupClass = () => {
  popup.classList.toggle("active")
}

const renderComponent = () => {
  root.innerHTML = markup();

  const city = document.getElementById("city");
  city.addEventListener("click", togglePopupClass);
};

const handleInput = (event) => {
  store = {
    ...store,
    city: event.target.value,
  }
}

const handleSubmit = (event) => {
  event.preventDefault();
  if (!store.city) return null;

  localStorage.setItem("query", store.city);
  fetchData();
  togglePopupClass();
};

const handleCloseBtn = (event) => {
  togglePopupClass();
}

form.addEventListener("submit", handleSubmit);
textInput.addEventListener("input", handleInput);
closeBtn.addEventListener("click", handleCloseBtn)
fetchData()