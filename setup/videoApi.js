const fetch = require("node-fetch");
const Constants = require('./Constants');

async function insertVideo(video, token) {
  const response = await fetch(Constants.API_URL + "/v1/videos", {
    method: "POST",
    body: JSON.stringify(video),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  console.log(`Video creation status: ${response.status}`);
}

async function findOneVideo(query, token) {
  console.log(Constants.API_URL);

  const response = await fetch(Constants.API_URL + `/v1/videos?query=${query}&page=0&size=1`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  const payload = await response.json();

  console.log('JSON', payload);
  const video = payload._embedded.videos[0];
  return video.id;
}

async function findVideos(query, token) {
  console.log(Constants.API_URL);

  const response = await fetch(Constants.API_URL + `/v1/videos?query=${query}&page=0&size=1`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  const payload = await response.json();

  console.log('JSON', payload);

  return payload._embedded.videos;
}

module.exports = {
  insertVideo,
  findOneVideo,
  findVideos
};
