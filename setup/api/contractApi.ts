import fetch from 'node-fetch';
import { API_URL } from '../Constants';
import { ContractFixture, ContractType } from '../fixture/contract';
import { Link } from './hateoas';
import {
  assertApiResourceCreation,
  assertApiResourceLookup,
  extractIdFromLocation,
} from './utilities';

export interface Contract {
  type: ContractType;
  name: string;
  _links: ContractLinks;
}

export interface ContractLinks {
  self: Link;
}

export interface SelectedVideosContract extends Contract {
  videoIds: string[];
}

interface HypermediaWrapper {
  _embedded: ContractsResource;
}

interface ContractsResource {
  contracts: Contract[];
}

export async function ensureContractAndReturnId(
  contract: ContractFixture,
  token: string,
): Promise<string> {
  let contractId = await findContractIdByName(contract.name, token);

  if (!contractId) {
    contractId = await createContract(contract, token);
  }

  return contractId;
}

export async function findContractByName(
  name: string,
  token: string,
): Promise<Contract | undefined> {
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

    const contract = contracts.find((it: Contract) => it.name === name);

    return contract ? contract : undefined;
  });
}

export async function findContractIdByName(
  name: string,
  token: string,
): Promise<string | undefined> {
  const contract = await findContractByName(name, token);

  if (contract) {
    const self = contract._links.self.href;
    return self.substring(self.lastIndexOf('/'));
  } else {
    return undefined;
  }
}

export async function createContract(
  contract: ContractFixture,
  token: string,
): Promise<string> {
  const response = await fetch(`${API_URL}/v1/contracts`, {
    method: 'POST',
    body: JSON.stringify(contract),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  await assertApiResourceCreation(response, 'ContractFixture creation');
  return extractIdFromLocation(response);
}
