import fetch from 'node-fetch';
import { API_URL } from '../Constants';
import { SelectedContentContract } from '../fixture/contract';
import { LinksHolder } from './hateoas';
import {
  assertApiResourceCreation,
  assertApiResourceLookup,
  extractIdFromLocation,
} from './utilities';

type SelectedContentContractResource = SelectedContentContract &
  LinksHolder & {
    id: string;
  };

interface HypermediaWrapper {
  _embedded: Contracts;
}

interface Contracts {
  contracts: SelectedContentContractResource[];
}

export async function ensureContractAndReturnId(
  contract: SelectedContentContract,
  token: string,
): Promise<string> {
  let contractId = await findContractIdByName(contract.name, token);

  if (!contractId) {
    contractId = await createContract(contract, token);
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
    assertApiResourceLookup(response, `Contract [name=${name}]`);

    const payload: HypermediaWrapper = await response.json();
    const contracts = payload._embedded.contracts;

    const contract = contracts.find(
      (it: SelectedContentContractResource) => it.name === name,
    );

    if (contract) {
      const self = contract._links.self.href;
      return self.substring(self.lastIndexOf("/"));
    } else {
      return undefined;
    }
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
    assertApiResourceCreation(response, 'Contract creation');
    return extractIdFromLocation(response);
  });
}
