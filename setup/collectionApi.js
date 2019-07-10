const fetch = require("node-fetch");
const Constants = require('./Constants');

module.exports = {
  insertCollection: insertCollection,
  getCollections: getCollections
};

async function insertCollection(collection, token) {
  return await fetch(Constants.API_URL + "/v1/collections", {
    method: "POST",
    body: JSON.stringify(collection),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  }).then(response => {
    console.log(
      `Collection creation status: ${response.status}`
    );
  });

}

async function getCollections(token) {
  const response = await fetch(Constants.API_URL + "/v1/collections", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  const payload = await response.json();

  if (payload && payload._embedded && payload._embedded.collections) {
    return payload._embedded.collections;
  } else {
    return undefined;
  }
}
