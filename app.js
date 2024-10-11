import countries from "./country-capitals.js";

const btnSubmit = document.querySelector("#submit");
const zoneTexte = document.querySelector(".search");
const zoneMessageErreur = document.querySelector("#message");
const temperatureElement = document.querySelector(".temperature-value");
const temperatureDescription = document.querySelector(
  ".temperature-description"
);
const locationElement = document.querySelector(".location");
const icone = document.querySelector(".weather-icon-img");
const temperatureUnitElement = document.querySelector(".temperature-unit");

let currentUnit = "C";
let temperatureCelsius = null;
let temperatureKelvin = null;

function estString(capital) {
  return typeof capital === "string";
}

function estDansLaListe(capital) {
  if (!estString(capital)) {
    console.log("Attention, ce n'est pas un mot");
    return false;
  }
  const inputEnMin = capital.toLowerCase();
  console.log(inputEnMin);
  return countries.some((cap) => {
    let capitalTableau = cap.CapitalName.toLowerCase();
    return capitalTableau === inputEnMin;
  });
}

function resetStyleBouton() {
  btnSubmit.style.backgroundColor = "";
  btnSubmit.style.color = "";
  btnSubmit.style.border = "";
}

function resetStyleTexte() {
  zoneTexte.style.backgroundColor = "";
  zoneTexte.style.color = "";
  zoneTexte.style.border = "";
}

function comportementErreurBoutonClick() {
  btnSubmit.style.backgroundColor = "#eb9582";
  btnSubmit.style.color = "red";
  btnSubmit.style.border = "solid red";
}

function comportementErreurTexte() {
  zoneTexte.style.backgroundColor = "#eb9582";
  zoneTexte.style.color = "red";
  zoneTexte.style.border = "solid red";
}

function soumissionVide() {
  btnSubmit.addEventListener("click", function (e) {
    e.preventDefault();
    if (zoneTexte.value === "") {
      zoneMessageErreur.innerHTML = "Champs obligatoire";
      comportementErreurBoutonClick();
      comportementErreurTexte();
    } else {
      zoneMessageErreur.innerHTML = "";
      inputCapital();
    }
  });
}

function inputCapital() {
  let capital = zoneTexte.value;
  if (!estDansLaListe(capital)) {
    comportementErreurBoutonClick();
    comportementErreurTexte();
    zoneMessageErreur.innerHTML = "Capitale introuvable";
  } else {
    zoneMessageErreur.innerHTML = "";
    recupererMeteo(capital);
  }
}

zoneTexte.addEventListener("input", function () {
  resetStyleBouton();
  resetStyleTexte();
  zoneMessageErreur.innerHTML = "";
});

function afficherMeteo(meteo) {
  if (meteo && meteo.responseBody) {
    const donnee = meteo.responseBody;
    temperatureKelvin = donnee.main.temp;
    temperatureCelsius = Math.round(temperatureKelvin - 273.15);
    const weatherDescription = donnee.weather[0].description;
    const iconId = donnee.weather[0].icon;
    const locationName = donnee.name;

    temperatureElement.textContent = temperatureCelsius;
    temperatureUnitElement.textContent = "C";
    currentUnit = "C";

    temperatureDescription.textContent = weatherDescription;
    locationElement.textContent = locationName;

    icone.src = `http://openweathermap.org/img/wn/${iconId}@2x.png`;
    icone.alt = weatherDescription;

    zoneTexte.value = "";
  } else {
    zoneMessageErreur.innerHTML = "Données météo manquantes.";
  }
}

function conversionTemperature() {
  if (currentUnit === "C") {
    temperatureElement.textContent = Math.round(temperatureKelvin);
    temperatureUnitElement.textContent = "K";
    currentUnit = "K";
  } else {
    temperatureElement.textContent = temperatureCelsius;
    temperatureUnitElement.textContent = "C";
    currentUnit = "C";
  }
}
temperatureUnitElement.addEventListener("click", conversionTemperature);

async function recupererMeteo(capital) {
  try {
    const response = await fetch(
      `https://react-starter-api.vercel.app/api/meteo/${capital}`
    );
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données météo");
    }
    const meteo = await response.json();
    afficherMeteo(meteo);
  } catch (error) {
    console.error(error);
    zoneMessageErreur.innerHTML =
      "Erreur lors de la récupération des données météo.";
  }
}

soumissionVide();
