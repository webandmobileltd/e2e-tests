import fetch from 'node-fetch';
import { API_URL } from '../Constants';
import { SelectedContentContract } from '../fixture/contract';
import { LinksHolder } from './hateoas';
import {
  assertCreateSucceeded,
  extractIdFromLocation,
  extractIdFromSelfUri,
} from './utilities';

type SelectedContentContractResource = SelectedContentContract & LinksHolder;

export async function ensureContractAndReturnId(
  contract: SelectedContentContract,
  token: string,
): Promise<string> {
  let contractId = await findContractIdByName(contract.name, token);

  if (!contractId) {
    console.log(`Contract '${contract.name}' does not exist yet, creating`);
    contractId = await createContract(contract, token);
  } else {
    console.log(`Contract '${contract.name}' exists`);
  }

  return contractId;
}

export async function findContractIdByName(
  name: string,
  token: string,
): Promise<string | undefined> {
  return fetch(`${API_URL}/v1/contracts?name=${name}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }).then(async response => {
    if (response.status === 404) {
      console.log(`Contract not found for name '${name}'`);
      return undefined;
    } else if (response.status !== 200) {
      throw new Error(`Contract lookup failed with status ${response.status}`);
    }

    const contract: SelectedContentContractResource = await response.json();

    const contractId = extractIdFromSelfUri(contract._links.self.href);
    console.log(`Found contract for name '${name}' with id ${contractId}`);

    return contractId;
  });
}

export async function createContract(
  contract: SelectedContentContract,
  token: string,
): Promise<string> {
  return fetch(`${API_URL}/v1/contracts`, {
    method: 'POST',
    body: JSON.stringify(contract),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }).then(async response => {
    assertCreateSucceeded('Contract', response);
    return extractIdFromLocation(response);
  });
}
