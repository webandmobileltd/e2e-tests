const fetch = require("node-fetch");
const Constants = require('./Constants');

module.exports = {
  insertDiscipline: insertDiscipline,
  getDisciplines: getDisciplines
};

async function insertDiscipline(discipline, subject, token) {
  return await fetch(Constants.API_URL + "/v1/disciplines", {
    method: "POST",
    body: JSON.stringify(discipline),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  }).then(response => {
    console.log(
      `Discipline creation status:, ${response.statusText} ${response.status}`
    );
    return response
  });
}

async function getDisciplines() {
  const response = await fetch(Constants.API_URL + "/v1/disciplines", {
    method: "GET",
  });
  const payload = await response.json();

  if (payload && payload._embedded && payload._embedded.disciplines) {
    return payload._embedded.disciplines;
  } else {
    return undefined;
  }
}
