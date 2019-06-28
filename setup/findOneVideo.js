const fetch = require("node-fetch");
const Constants = require('./Constants');

module.exports = async function insertVideo(query, token) {
  console.log(Constants.API_URL);

  return await fetch(Constants.API_URL + `/v1/videos?query=${query}&page=0&size=1`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  }).then(response => {
    return response.json();
  }).then(json => {
    console.log('JSON', json);
    const video = json._embedded.videos[0];
    return video.id;
  });
};
