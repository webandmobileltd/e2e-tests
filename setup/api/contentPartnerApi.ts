import fetch from 'node-fetch';
import * as Constants from '../Constants';
import { API_URL } from '../Constants';

interface HypermediaWrapper {
  _links: any;
  _embedded: ContentPartners;
}

interface ContentPartners {
  contentPartners: ContentPartner[];
}

export interface ContentPartner {
  name: string;
  id?: string;
  accreditedToYtChannelId?: string;
  ageRange?: any;
  distributionMethods?: string[];
}

export async function insertContentPartner(
  contentPartner: ContentPartner,
  token: string,
) {
  return fetch(Constants.API_URL + '/v1/content-partners', {
    method: 'POST',
    body: JSON.stringify(contentPartner),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }).then(response => {
    console.log(
      `Content Partner creation status:, ${response.statusText} ${
        response.status
      }`,
    );
  });
}

export async function getContentPartners(
  token: string,
): Promise<ContentPartner[]> {
  const response = await fetch(`${API_URL}/v1/content-partners`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const payload: HypermediaWrapper = await response.json();
  return payload._embedded.contentPartners;
}
