import fetch from 'node-fetch';
import { OPERATOR_PASSWORD, OPERATOR_USERNAME } from './Constants';

import * as Constants from './Constants';
import {assertApiResourceCreation} from "./api/utilities";

interface AccessTokenResponse {
  access_token: string;
}

export async function generateToken(): Promise<string> {
  const response = await fetch(Constants.TOKEN_URL, {
    method: 'POST',
    body: `grant_type=password&client_id=boclips-admin&username=${OPERATOR_USERNAME}&password=${OPERATOR_PASSWORD}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  assertApiResourceCreation(response, `Token generation for user ${Constants.OPERATOR_USERNAME}`);
  const body: AccessTokenResponse = await response.json();

  return body.access_token;
}
