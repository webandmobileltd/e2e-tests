import fetch from 'node-fetch';
import * as Constants from '../Constants';
import { AgeRangeFixture } from '../fixture/ageRanges';
import { Link } from './hateoas';
import { assertApiResourceCreation } from './utilities';

interface HypermediaWrapper {
  _embedded: AgeRanges;
}

interface AgeRanges {
  ageRanges: AgeRange[];
}

export interface AgeRangeLinks {
  self: Link;
}

export interface AgeRange {
  id: string;
  label: string;
  min: number;
  max?: number;
  _links: AgeRangeLinks;
}

export async function insertAgeRange(ageRange: AgeRangeFixture, token: string) {
  const response = await fetch(Constants.API_URL + '/v1/age-ranges', {
    method: 'POST',
    body: JSON.stringify(ageRange),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  await assertApiResourceCreation(response, 'Age range creation');
}

export async function getAgeRanges(): Promise<AgeRange[] | undefined> {
  const response = await fetch(Constants.API_URL + '/v1/age-ranges', {
    method: 'GET',
  });
  const payload: HypermediaWrapper = await response.json();

  if (payload && payload._embedded && payload._embedded.ageRanges) {
    return payload._embedded.ageRanges;
  } else {
    return undefined;
  }
}

export async function findOneAgeRange(ageRangeId: string, token: string) {
  const response = await fetch(
    `${Constants.API_URL}/v1/age-ranges/${ageRangeId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const payload = await response.json();
  return payload && payload.id;
}
