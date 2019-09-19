import fetch from 'node-fetch';
import { API_URL } from '../Constants';
import { ApiIntegrationFixture } from '../fixture/apiIntegration';
import { LinksHolder } from './hateoas';
import {
  assertApiCall,
  extractIdFromLocation,
  extractIdFromSelfUri,
} from './utilities';

type ApiIntegrationResource = LinksHolder & {
  name: string;
};

export async function ensureApiIntegrationAndReturnId(
  apiIntegration: ApiIntegrationFixture,
  token: string,
): Promise<string> {
  let apiIntegrationId = await findApiIntegrationIdByName(
    apiIntegration.name,
    token,
  );

  if (!apiIntegrationId) {
    console.log(
      `API Integration '${apiIntegration.name}' does not exist yet, creating`,
    );
    apiIntegrationId = await createApiIntegration(apiIntegration, token);
  } else {
    console.log(`API Integration '${apiIntegration.name}' exists`);
  }

  return apiIntegrationId;
}

export async function findApiIntegrationIdByName(
  name: string,
  token: string,
): Promise<string | undefined> {
  return fetch(`${API_URL}/v1/api-integrations?name=${name}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }).then(async response => {
    if (response.status === 404) {
      console.log(`API Integration not found for name '${name}'`);
      return undefined;
    } else if (response.status !== 200) {
      throw new Error(
        `API Integration lookup failed with status ${response.status}`,
      );
    }

    const apiIntegration: ApiIntegrationResource = await response.json();

    const apiIntegrationId = extractIdFromSelfUri(
      apiIntegration._links.self.href,
    );
    console.log(
      `Found API Integration for name '${name}' with id ${apiIntegrationId}`,
    );

    return apiIntegrationId;
  });
}

export async function createApiIntegration(
  apiIntegration: ApiIntegrationFixture,
  token: string,
): Promise<string> {
  return fetch(`${API_URL}/v1/api-integrations`, {
    method: 'POST',
    body: JSON.stringify(apiIntegration),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }).then(async response => {
    assertApiCall(response, 'API Integration creation');
    return extractIdFromLocation(response);
  });
}
