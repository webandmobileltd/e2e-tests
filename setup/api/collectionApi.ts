import fetch from 'node-fetch';
import { API_URL } from '../Constants';
import { CollectionFixture } from '../fixture/collections';

interface HypermediaWrapper {
  _embedded: Collections;
}

interface Collections {
  collections: Collection[];
}

export interface Collection {
  id: string;
}

export async function insertCollection(
  collection: CollectionFixture,
  token: string,
) {
  await fetch(`${API_URL}/v1/collections`, {
    method: 'POST',
    body: JSON.stringify(collection),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }).then(response => {
    console.log(`Collection creation status: ${response.status}`);
  });
}

export async function getCollections(
  token: string,
): Promise<Collection[] | undefined> {
  const response = await fetch(API_URL + '/v1/collections', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const payload = await response.json();
  if (payload && payload._embedded && payload._embedded.collections) {
    return payload._embedded.collections;
  } else {
    return undefined;
  }
}

export async function addVideoToCollection(
  collectionId: string,
  videoId: string,
  token: string,
) {
  return fetch(`${API_URL}/v1/collections/${collectionId}/videos/${videoId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }).then(response => {
    console.log(`Adding video to collection status: ${response.status}`);
  });
}

export async function findOneCollectionId(
  query: string,
  token: string,
): Promise<string> {
  const response = await fetch(
    `${API_URL}/v1/collections?query=${query}&page=0&size=1`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  const payload: HypermediaWrapper = await response.json();

  return payload._embedded.collections[0].id;
}
