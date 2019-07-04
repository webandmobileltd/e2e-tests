const fetch = require("node-fetch");
const Constants = require('./Constants');

module.exports = async function insertVideo(video, token) {
  const response = await fetch(Constants.API_URL + "/v1/videos", {
    method: "POST",
    body: JSON.stringify(video),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  console.log(`Video creation status: ${response.status}`);
};


