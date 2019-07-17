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
  const response = await fetch(Constants.API_URL + `/v1/videos?query=${query}&page=0&size=1`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  const payload = await response.json();

  console.log('Single video lookup result', payload);
  const video = payload._embedded.videos[0];
  return video.id;
}

async function findVideos(query, token, attempts) {
  // Attempts logic implemented due to a race condition where videos are queried
  // straight after inserting and indexing did not finish in time.
  if (attempts === undefined) {
    attempts = 1
  }
  if (attempts > 10) {
    throw new Error('Max query attempts reached')
  }

  const response = await fetch(Constants.API_URL + `/v1/videos?query=${query}&page=0&size=1`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  const payload = await response.json();

  console.log('Videos query result:', payload);

  if (payload._embedded.videos.length === 0) {
    await sleepForMillis(1000);
    return findVideos(query, token, attempts + 1);
  }

  return payload._embedded.videos;
}

async function sleepForMillis(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

module.exports = {
  insertVideo,
  findOneVideo,
  findVideos
};
