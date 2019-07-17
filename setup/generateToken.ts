import fetch from 'node-fetch';
import { OPERATOR_PASSWORD, OPERATOR_USERNAME } from './Constants';

import * as Constants from './Constants';

interface AccessTokenResponse {
  access_token: string;
}

export async function generateToken(): Promise<string> {
  const response = await fetch(Constants.TOKEN_URL, {
    method: 'POST',
    body: `grant_type=password&client_id=admin-cli&username=${OPERATOR_USERNAME}&password=${OPERATOR_PASSWORD}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const body: AccessTokenResponse = await response.json();
  console.log(`Generated user token for user ${Constants.OPERATOR_USERNAME}`);

  return body.access_token;
}
