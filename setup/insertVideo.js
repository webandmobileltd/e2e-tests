const fetch = require("node-fetch");
const Constants = require('./Constants');

module.exports = async function insertVideo(video, token) {
  console.log("Publish video:", video);

  console.log(Constants.VIDEO_SERVICE_URL);

  return await fetch(Constants.VIDEO_SERVICE_URL + "/v1/videos", {
    method: "POST",
    body: JSON.stringify(video),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  }).then(response => {
    console.log(
      `Video creation status:, ${response.statusText} ${response.status}`
    );
  });
}
