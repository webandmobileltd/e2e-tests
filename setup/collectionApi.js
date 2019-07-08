const fetch = require("node-fetch");
const Constants = require('./Constants');

module.exports = {
  insertCollection: async function insertCollection(collection, token) {
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

  },

  getCollections: async function getCollections(token) {
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
  },

  addVideoToCollection: async function addVideoToCollection(collectionId, videoId, token) {
    return await fetch(`${Constants.API_URL}/v1/collections/${collectionId}/videos/${videoId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }).then(response => {
      console.log(
        `Collection creation status: ${response.status}`
      );
    });
  },

  findOneCollectionId: async function findOneCollection(query, token) {
    console.log(Constants.API_URL);

    const response = await fetch(Constants.API_URL + `/v1/collections?query=${query}&page=0&size=1`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const payload = await response.json();

    return payload._embedded.collections[0].id;
  }
};
