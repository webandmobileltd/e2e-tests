const fetch = require("node-fetch");
const Constants = require('./Constants');
const subjectApi = require("./subjectApi");

module.exports = {
  insertDiscipline: insertDiscipline,
  getDisciplines: getDisciplines
};

async function insertDiscipline(discipline, token) {
  const subject = await subjectApi.getSubjectByName(discipline.associatedSubject);

  delete discipline.associatedSubject;
  return await fetch(Constants.API_URL + "/v1/disciplines", {
    method: "POST",
    body: JSON.stringify(discipline),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  }).then(response => {
    console.log(
      `Discipline creation status: ${response.status}`
    );
    return response.json()
  }).then(discipline => {
    return fetch(discipline._links.subjects.href, {
      method: "PUT",
      body: subject._links.self.href,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/uri-list"
      }
    }).then(response => {
      console.log(
        `Subjects associated to discipline: ${response.status}`
      );
    });
  });

}

async function getDisciplines(token) {
  const response = await fetch(Constants.API_URL + "/v1/disciplines", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  const payload = await response.json();
  if (payload && payload._embedded && payload._embedded.disciplines) {
    return payload._embedded.disciplines;
  } else {
    return undefined;
  }
}
