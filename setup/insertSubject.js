const fetch = require("node-fetch");
const Constants = require('./Constants');

module.exports = async function insertSubject(subject, token) {
  return await fetch(Constants.VIDEO_SERVICE_URL + "/v1/subjects", {
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
};
