const fetch = require("node-fetch");
const Constants = require('./Constants');

module.exports = {
  insertSubject: insertSubject,
  deleteSubject: deleteSubject,
  getSubjects: getSubjects,
  getSubjectByName
};

async function insertSubject(subject, token) {
  return await fetch(Constants.API_URL + "/v1/subjects", {
    method: "POST",
    body: JSON.stringify(subject),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  }).then(response => {
    console.log(
      `Subject creation status:, ${response.statusText} ${response.status}`
    );
  });
}

async function deleteSubject(subjectId, token) {
  return await fetch(`${Constants.API_URL}/v1/subjects/${subjectId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      console.log(
        `Subject deleted status:, ${response.statusText} ${response.status}`
      );
    });
}

async function getSubjects() {
  const response = await fetch(Constants.API_URL + "/v1/subjects", {
    method: "GET",
  });
  const payload = await response.json();

  if (payload && payload._embedded && payload._embedded.subjects) {
    return payload._embedded.subjects;
  } else {
    return undefined;
  }
}

async function getSubjectByName(subjectName) {
  const subjects = await getSubjects();
  return subjects.find(s => s.name === subjectName);
}
